# Initial JS per page (gzipped), from the production build. Usage: python3 scripts/budget.py
import re, gzip, os
root = os.path.join(os.path.dirname(__file__), "..", ".next")
for page, html in [("/", "server/app/index.html"), ("/recruiter", "server/app/recruiter.html")]:
    s = open(os.path.join(root, html)).read()
    srcs = sorted(set(re.findall(r'src="/_next/(static/[^"]+\.js)"', s)))
    total = sum(len(gzip.compress(open(os.path.join(root, x), "rb").read(), 9)) for x in srcs)
    print(f"{page:11s} {len(srcs):2d} scripts  {total/1024:6.1f} KB gzipped  (budget 200)")
