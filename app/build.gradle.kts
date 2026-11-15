plugins {
    id("com.android.application")
}

android {
    namespace = "com.pixeladventure.game"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.pixeladventure.game"
        minSdk = 26
        targetSdk = 34
        versionCode = 17
        versionName = "1.5"
    }

    // One permanent key for every build, so a new APK installs over the old one and keeps the save.
    // CI decodes the GitHub secrets SIGNING_KEYSTORE_B64 / SIGNING_PASSWORD into CM_KEYSTORE / CM_KEY_PASS.
    // Without them (e.g. a local build) the normal debug key is used.
    val ks = System.getenv("CM_KEYSTORE")
    val ksPass = System.getenv("CM_KEY_PASS")
    val hasKey = !ks.isNullOrEmpty() && !ksPass.isNullOrEmpty() && file(ks).exists()
    signingConfigs {
        if (hasKey) create("cottage") {
            storeFile = file(ks!!)
            storePassword = ksPass
            keyAlias = "cottage"
            keyPassword = ksPass
        }
    }

    buildTypes {
        release { isMinifyEnabled = false }
        getByName("debug") { if (hasKey) signingConfig = signingConfigs.getByName("cottage") }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
