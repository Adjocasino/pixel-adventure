"""Builds demos/fruit_catch.html from tools/fruit_catch_src.html + the bilao sheet (run tools/adjo_bilao.py first)."""
import base64, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
A = os.path.join(R, 'assets', 'characters', 'farmer')
b = base64.b64encode(open(os.path.join(A, 'adjo_bilao_sheet.png'), 'rb').read()).decode()
meta = open(os.path.join(A, 'adjo_bilao_sheet.json')).read()
src = open(os.path.join(R, 'tools', 'fruit_catch_src.html')).read()
open(os.path.join(R, 'demos', 'fruit_catch.html'), 'w').write(src.replace('__ADJO__', b).replace('__META__', meta))
print('ok')
