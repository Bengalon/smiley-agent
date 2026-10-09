"""Music beds for the V2 ads. Times match src/v2/Ad*.tsx (VO offset + word times)."""
import os, sys
from trailer import render

out = sys.argv[1] if len(sys.argv) > 1 else "../public/music2"
os.makedirs(out, exist_ok=True)
V = lambda off, t: off + t
render(33.5, V(0.25, 9.96), V(0.25, 29.1), out=f"{out}/manifesto.wav", build=2.2)
render(14.0, V(0.15, 4.92), V(0.15, 9.96), out=f"{out}/short.wav", build=1.6)
render(20.5, V(0.2, 6.22), V(0.2, 16.32), out=f"{out}/twoplayers.wav", build=2.0)
render(44.0, V(0.25, 9.30), V(0.25, 39.5), out=f"{out}/story.wav", build=2.4, breaks=[(V(0.25, 25.5), V(0.25, 32.1))])
render(20.5, V(0.2, 2.30), V(0.2, 16.06), out=f"{out}/challenge.wav", build=2.0, breaks=[(V(0.2, 9.88), V(0.2, 12.06))])
print("ok")
