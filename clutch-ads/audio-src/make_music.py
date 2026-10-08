"""Render one music bed per ad into public/music. Section times match src/ads/*.tsx."""
import os, sys
import numpy as np
from synth import SR, write_wav, normalize, place, soft_clip
from music import render_song, final_hit

out = sys.argv[1] if len(sys.argv) > 1 else "../public/music"
os.makedirs(out, exist_ok=True)

GROOVE = {"kick", "clap", "hats", "bass", "chords"}


def song(name, bpm, sections, total, end_hit=None, end_chord=0, fade=1.2):
    mix, _ = render_song(sections, bpm, tail=3.0)
    n = int(total * SR)
    if len(mix) < n:
        mix = np.concatenate([mix, np.zeros((n - len(mix), 2))])
    mix = mix[:n]
    if end_hit is not None:
        mix[int(end_hit * SR):] *= 0.0
        hit = np.zeros_like(mix)
        final_hit(hit, end_hit, end_chord, 0.95)
        mix += hit
    f = int(fade * SR)
    mix[-f:] *= np.linspace(1, 0, f)[:, None] ** 1.5
    from synth import limiter, loudness_norm
    mix = limiter(loudness_norm(mix, -15.0), 0.93)
    write_wav(f"{out}/{name}.wav", mix)
    print(name, total)


# Ad 1, hype, 128 BPM, 8 bars = 15 s
song("ad1", 128, [
    {"bars": 1, "layers": {"impact_start", "kick", "hats", "bass", "chords_filtered"}},
    {"bars": 3, "layers": GROOVE | {"hats16", "arp"}},
    {"bars": 1, "layers": {"heartbeat", "pad", "riser_end", "snare_roll"}, "riser_len": 1.9},
    {"bars": 2, "layers": GROOVE | {"impact_start", "hats_open", "arp"}},
    {"bars": 1, "layers": set()},
], total=15.0, end_hit=60 / 128 * 4 * 7)

# Ad 2, not luck, 120 BPM, 18 bars = 36 s
song("ad2", 120, [
    {"bars": 2, "layers": {"pad", "sub_long"}},
    {"bars": 2, "layers": {"pad", "sub_long", "kick_half", "hats"}},
    {"bars": 2, "layers": {"riser_end"}, "riser_len": 3.4},
    {"bars": 4, "layers": {"impact_start", "kick", "clap", "hats", "bass", "chords_filtered"}},
    {"bars": 4, "layers": GROOVE | {"arp"}},
    {"bars": 1, "layers": {"bass", "chords_filtered", "snare_roll", "riser_end"}, "riser_len": 2.0},
    {"bars": 1, "layers": GROOVE | {"impact_start", "hats_open", "arp"}},
    {"bars": 2, "layers": set()},
], total=36.0, end_hit=32.0, end_chord=0)

# Ad 3, how it works, 120 BPM, 27 bars = 54 s
song("ad3", 120, [
    {"bars": 2, "layers": {"pad", "arp"}},
    {"bars": 9, "layers": {"kick", "clap", "hats", "bass", "chords_filtered"}},
    {"bars": 4, "layers": GROOVE | {"hats16", "riser_end"}, "riser_len": 2.0},
    {"bars": 4, "layers": GROOVE | {"impact_start", "hats_open", "arp"}},
    {"bars": 4, "layers": {"kick", "hats", "bass", "arp", "chords_filtered"}},
    {"bars": 1, "layers": GROOVE},
    {"bars": 3, "layers": set()},
], total=54.0, end_hit=48.0, end_chord=0)

# Ad 4, the clutch moment, 120 BPM, 28 bars = 56 s
song("ad4", 120, [
    {"bars": 4, "layers": {"pad", "sub_long"}},
    {"bars": 1, "layers": {"pad", "sub_long", "riser_end"}, "riser_len": 2.0},
    {"bars": 4, "layers": {"impact_start", "kick", "hats", "bass", "chords_filtered"}},
    {"bars": 5, "layers": {"kick", "clap", "hats", "hats16", "bass", "chords_filtered", "arp"}},
    {"bars": 1, "layers": {"downlifter_start", "pad", "sub_long"}},
    {"bars": 3, "layers": {"impact_start", "heartbeat", "sub_long"}},
    {"bars": 4, "layers": {"impact_start", "heartbeat", "sub_long", "riser_end"}, "riser_len": 3.8},
    {"bars": 3, "layers": GROOVE | {"impact_start", "hats_open", "arp"}},
    {"bars": 3, "layers": set()},
], total=56.0, end_hit=50.0, end_chord=0)

# Ad 5, the challenge, 128 BPM, 12 bars + tail = 23.5 s
song("ad5", 128, [
    {"bars": 1, "layers": {"pad", "riser_end"}, "riser_len": 1.8},
    {"bars": 2, "layers": {"kick_half", "hats", "bass", "chords_filtered"}},
    {"bars": 1, "layers": GROOVE | {"impact_start"}},
    {"bars": 2, "layers": {"kick_half", "hats", "bass", "chords_filtered"}},
    {"bars": 1, "layers": GROOVE | {"arp"}},
    {"bars": 2, "layers": {"kick_half", "hats", "hats16", "bass", "chords_filtered", "riser_end"}, "riser_len": 1.9},
    {"bars": 2, "layers": GROOVE | {"impact_start", "hats_open", "arp"}},
    {"bars": 2, "layers": set()},
], total=23.5, end_hit=60 / 128 * 4 * 11)
