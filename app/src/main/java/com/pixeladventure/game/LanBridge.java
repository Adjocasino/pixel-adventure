package com.pixeladventure.game;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * LAN multiplayer for two phones on the same hotspot or Wi-Fi. No internet, no server.
 * Host: TCP server on PORT + a UDP "I'm here" beacon on BEACON every second.
 * Join: listen for beacons (or type the host's IP), then connect over TCP.
 * Messages are single lines of JSON; incoming lines are handed to JS as MPN.msg(line).
 */
public class LanBridge {
    static final int PORT = 47777, BEACON = 47778;
    private final Activity act;
    private final WebView web;
    private volatile ServerSocket server;
    private volatile Socket sock;
    private volatile boolean hosting, scanning;
    private volatile int gen;
    private final LinkedBlockingQueue<String> out = new LinkedBlockingQueue<>();
    private Thread writer;
    private WifiManager.MulticastLock mlock;

    LanBridge(Activity act, WebView web) { this.act = act; this.web = web; }

    private void js(final String code) {
        act.runOnUiThread(() -> { try { web.evaluateJavascript(code, null); } catch (Exception ignored) { } });
    }

    private static String q(String s) { return JSONObject.quote(s == null ? "" : s); }

    /** IPv4 addresses of this phone (shown on the host screen so the other player can type one). */
    @JavascriptInterface
    public String ips() {
        JSONArray a = new JSONArray();
        try {
            for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!ni.isUp() || ni.isLoopback()) continue;
                for (InetAddress ad : Collections.list(ni.getInetAddresses()))
                    if (ad instanceof Inet4Address) a.put(ad.getHostAddress());
            }
        } catch (Exception ignored) { }
        return a.toString();
    }

    private List<InetAddress> broadcastAddrs() {
        List<InetAddress> l = new ArrayList<>();
        try {
            for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!ni.isUp() || ni.isLoopback()) continue;
                for (InterfaceAddress ia : ni.getInterfaceAddresses())
                    if (ia.getBroadcast() != null) l.add(ia.getBroadcast());
            }
            l.add(InetAddress.getByName("255.255.255.255"));
        } catch (Exception ignored) { }
        return l;
    }

    @JavascriptInterface
    public void host(final String name) {
        close();
        hosting = true;
        final int g = gen;
        new Thread(() -> {
            try {
                ServerSocket ss = new ServerSocket();
                ss.setReuseAddress(true);
                ss.bind(new InetSocketAddress(PORT));
                server = ss;
                js("MPN.hosting(" + ips() + ")");
                Socket s = ss.accept();          // one friend
                hosting = false;
                try { ss.close(); } catch (Exception ignored) { }
                server = null;
                attach(s, true);
            } catch (Exception e) {
                if (g == gen) { js("MPN.error(" + q("Could not host: " + e.getMessage()) + ")"); hosting = false; }
            }
        }, "mp-host").start();
        new Thread(() -> {                         // beacon so the joiner can find us
            try (DatagramSocket ds = new DatagramSocket()) {
                ds.setBroadcast(true);
                byte[] msg = ("CMHOST|" + name + "|" + PORT).getBytes(StandardCharsets.UTF_8);
                while (hosting && g == gen) {
                    for (InetAddress b : broadcastAddrs()) {
                        try { ds.send(new DatagramPacket(msg, msg.length, b, BEACON)); } catch (Exception ignored) { }
                    }
                    Thread.sleep(1000);
                }
            } catch (Exception ignored) { }
        }, "mp-beacon").start();
    }

    @JavascriptInterface
    public void scan() {
        if (scanning) return;
        scanning = true;
        new Thread(() -> {
            try {
                WifiManager wm = (WifiManager) act.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
                if (wm != null) { mlock = wm.createMulticastLock("cm-scan"); mlock.setReferenceCounted(false); mlock.acquire(); }
            } catch (Exception ignored) { }
            try (DatagramSocket ds = new DatagramSocket(null)) {
                ds.setReuseAddress(true);
                ds.setBroadcast(true);
                ds.bind(new InetSocketAddress(BEACON));
                ds.setSoTimeout(500);
                long end = System.currentTimeMillis() + 5000;
                byte[] buf = new byte[256];
                while (System.currentTimeMillis() < end) {
                    try {
                        DatagramPacket p = new DatagramPacket(buf, buf.length);
                        ds.receive(p);
                        String s = new String(p.getData(), 0, p.getLength(), StandardCharsets.UTF_8);
                        if (s.startsWith("CMHOST|")) {
                            String[] parts = s.split("\\|");
                            js("MPN.found(" + q(p.getAddress().getHostAddress()) + "," + q(parts.length > 1 ? parts[1] : "Friend") + ")");
                        }
                    } catch (java.net.SocketTimeoutException ignored) { }
                }
            } catch (Exception e) {
                js("MPN.error(" + q("Search failed: " + e.getMessage()) + ")");
            } finally {
                scanning = false;
                try { if (mlock != null) mlock.release(); } catch (Exception ignored) { }
                js("MPN.scanDone()");
            }
        }, "mp-scan").start();
    }

    @JavascriptInterface
    public void join(final String ip) {
        close();
        new Thread(() -> {
            try {
                Socket s = new Socket();
                s.connect(new InetSocketAddress(ip.trim(), PORT), 5000);
                attach(s, false);
            } catch (Exception e) {
                js("MPN.error(" + q("Could not join " + ip + ": " + e.getMessage()) + ")");
            }
        }, "mp-join").start();
    }

    private void attach(final Socket s, final boolean isHost) {
        try { s.setTcpNoDelay(true); s.setKeepAlive(true); } catch (Exception ignored) { }
        sock = s;
        out.clear();
        js("MPN.connected(" + isHost + ")");
        writer = new Thread(() -> {
            try {
                OutputStream os = s.getOutputStream();
                while (sock == s) {
                    String line = out.take();
                    if (sock != s) break;
                    os.write((line + "\n").getBytes(StandardCharsets.UTF_8));
                    os.flush();
                }
            } catch (Exception ignored) { }
        }, "mp-writer");
        writer.start();
        new Thread(() -> {
            try (BufferedReader r = new BufferedReader(new InputStreamReader(s.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = r.readLine()) != null) js("MPN.msg(" + q(line) + ")");
            } catch (Exception ignored) { }
            if (sock == s) { sock = null; js("MPN.closed()"); }
        }, "mp-reader").start();
    }

    @JavascriptInterface
    public void send(String line) { if (sock != null) out.offer(line); }

    @JavascriptInterface
    public void close() {
        gen++;
        hosting = false;
        Socket s = sock;
        sock = null;
        try { if (s != null) s.close(); } catch (Exception ignored) { }
        try { if (server != null) server.close(); } catch (Exception ignored) { }
        server = null;
        out.offer("");      // wake the writer so it can exit
    }
}
