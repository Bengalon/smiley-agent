"""Render the sound effects pack into public/sfx."""
import os, sys
import numpy as np
from synth import *

out = sys.argv[1] if len(sys.argv) > 1 else "../public/sfx"
os.makedirs(out, exist_ok=True)
for n in ["tap", "clack", "deal", "flip", "first", "oppfirst", "good", "bad", "roundwin", "roundlose",
          "streak", "tick", "beat", "count", "match", "win", "lose", "coin"]:
    write_wav(f"{out}/{n}.wav", normalize(site_sfx(n), 0.85))
write_wav(f"{out}/whoosh.wav", whoosh())
write_wav(f"{out}/whoosh-short.wav", whoosh(0.3, 600, 7000, 1500))
write_wav(f"{out}/whoosh-rev.wav", whoosh(0.45, 6000, 400, 2000, 0.7, -0.7))
write_wav(f"{out}/impact.wav", impact())
write_wav(f"{out}/impact-big.wav", impact(3.2, 48, 1.3))
write_wav(f"{out}/riser-2s.wav", riser(2.0))
write_wav(f"{out}/riser-4s.wav", riser(4.0, 120, 1600))
write_wav(f"{out}/downlifter.wav", downlifter())
write_wav(f"{out}/heartbeat.wav", heartbeat())
write_wav(f"{out}/coins.wav", coins_cascade())
write_wav(f"{out}/pop.wav", pop())
write_wav(f"{out}/glitch.wav", glitch())
write_wav(f"{out}/slot-spin.wav", slot_spin())
write_wav(f"{out}/ding.wav", bell_ding())
write_wav(f"{out}/tape-stop.wav", tape_stop())
print("ok")
