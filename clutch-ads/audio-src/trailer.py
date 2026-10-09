"""Trailer + trap sound design for the V2 Clutch ads.

The beds are dark and pulsing while the story is about luck, then drop into a hard
trap beat exactly when the voice-over turns to "bet on yourself".
"""
import numpy as np
from synth import (SR, RNG, osc, biquad, ramp_exp, reverb, soft_clip, normalize, stereo, place,
                   impact, riser, downlifter, whoosh, write_wav, limiter, loudness_norm)

ROOT = 41  # F2


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def n(sec):
    return int(round(sec * SR))


# ------------------------------------------------------------------ instruments
def braam(sec=3.0, note=29, gain=1.0):
    """Big low brass-like swell: detuned saws, opening low-pass, distortion."""
    t = np.arange(n(sec)) / SR
    y = np.zeros(n(sec))
    for m, a in [(note, 1.0), (note + 12, 0.6), (note + 7, 0.35), (note - 12, 0.5)]:
        for d in (-0.012, -0.004, 0.004, 0.012):
            y += osc(mtof(m) * (1 + d), sec, "sawtooth", RNG.random()) * a
    cut = 120 + 2600 * np.clip(t / 0.35, 0, 1) ** 1.5 * np.exp(-t * 0.9)
    y = biquad(y, "lowpass", cut, 1.4)
    env = np.minimum(1, t / 0.06) * np.exp(-t * 0.9)
    y = soft_clip(y * env * 0.25, 2.2)
    return normalize(reverb(y, 0.35, 3.0)[: n(sec + 1.5)], 0.95 * gain)


def hit(sec=2.5, gain=1.0):
    """Cinematic hit: impact + metallic ring + noise crack"""
    base = impact(sec, 50, 1.2)
    t = np.arange(n(sec)) / SR
    ring = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) * a for f, d, a in [(1180, 6, 0.25), (1730, 8, 0.18), (2650, 10, 0.12), (420, 3, 0.25)])
    ring = reverb(ring * 0.5, 0.5, 2.5)[: n(sec)]
    return normalize(base + ring, 0.95 * gain)


def sub_drop(sec=1.6):
    t = np.arange(n(sec)) / SR
    f = ramp_exp(110, 28, sec)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    return normalize(soft_clip(y * 1.5, 1.5), 0.95)


def reverse_swell(sec=1.2):
    t = np.arange(n(sec)) / SR
    x = biquad(RNG.standard_normal(n(sec)), "highpass", 3000) * np.exp(-t * 3.5)
    x = reverb(x, 0.6, 2.0)[: n(sec)][::-1]
    return normalize(x, 0.7)


def glass(sec=1.6, seed=4):
    """Glass shatter: sharp crack + many bright tinkles + noise"""
    rng = np.random.default_rng(seed)
    out = np.zeros(n(sec))
    t = np.arange(n(sec)) / SR
    out += biquad(RNG.standard_normal(n(sec)) * np.exp(-t * 18), "highpass", 2500) * 0.8
    for k in range(70):
        at = rng.exponential(0.18)
        if at > sec - 0.2:
            continue
        L = n(0.12)
        tt = np.arange(L) / SR
        f0 = rng.uniform(3000, 9000)
        s = (np.sin(2 * np.pi * f0 * tt) + 0.5 * np.sin(2 * np.pi * f0 * 1.51 * tt)) * np.exp(-tt * rng.uniform(30, 70))
        i = n(at)
        out[i:i + L] += s[: len(out[i:i + L])] * rng.uniform(0.05, 0.3)
    out += impact(sec, 70, 0.6)[:, 0][: n(sec)] * 0.5
    return normalize(reverb(out, 0.3, 1.5)[: n(sec)], 0.9)


def swish(sec=0.35):
    t = np.linspace(0, 1, n(sec))
    x = biquad(RNG.standard_normal(n(sec)), "bandpass", ramp_exp(1200, 8000, sec), 1.2) * np.sin(np.pi * t) ** 2
    return normalize(stereo(x, 0.2), 0.6)


def tick(gain=1.0):
    t = np.arange(n(0.06)) / SR
    return biquad(RNG.standard_normal(n(0.06)) * np.exp(-t * 120), "bandpass", 3500, 3) * gain


def kick808(note=ROOT - 12, sec=0.9, gain=1.0):
    t = np.arange(n(sec)) / SR
    f = mtof(note) * (1 + 3.0 * np.exp(-t * 28))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    return soft_clip(y * 2.0, 1.8) * gain


def bass808(note, sec, glide_from=None, gain=1.0):
    t = np.arange(n(sec)) / SR
    f0 = mtof(note)
    f = f0 if glide_from is None else mtof(glide_from) + (f0 - mtof(glide_from)) * np.minimum(1, t / 0.08)
    f = np.broadcast_to(f, t.shape)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR)
    env = np.minimum(1, t / 0.005) * np.exp(-t * 1.2) * np.clip((sec - t) / 0.03, 0, 1)
    return soft_clip(y * env * 1.8, 2.0) * gain


def snare(gain=1.0):
    t = np.arange(n(0.35)) / SR
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
    nz = biquad(RNG.standard_normal(len(t)), "bandpass", 2400, 0.7) * np.exp(-t * 16)
    clap = biquad(RNG.standard_normal(len(t)), "bandpass", 1300, 1.0) * (np.exp(-t * 60) + 0.5 * np.exp(-np.clip(t - 0.012, 0, None) * 25) * (t > 0.012))
    return soft_clip((body * 0.6 + nz * 0.7 + clap * 0.9) * 1.4, 1.3) * gain


def hat(open_=False, gain=1.0):
    L = n(0.25 if open_ else 0.045)
    t = np.arange(L) / SR
    return biquad(RNG.standard_normal(L), "highpass", 9000) * np.exp(-t * (12 if open_ else 110)) * 0.6 * gain


def pluck(note, sec=0.22, gain=1.0, bright=5000):
    t = np.arange(n(sec)) / SR
    f = mtof(note)
    s = osc(f, sec, "sawtooth") * 0.6 + osc(f * 1.005, sec, "square") * 0.3
    return biquad(s, "lowpass", 250 + bright * np.exp(-t * 20), 1.3) * np.exp(-t * 9) * gain


def drone(sec, note=ROOT - 12, gain=1.0):
    t = np.arange(n(sec)) / SR
    y = sum(osc(mtof(note) * (1 + d), sec, "sawtooth", RNG.random()) for d in (-0.006, 0, 0.007))
    y += 0.6 * osc(mtof(note + 7), sec, "sawtooth")
    lfo = 260 + 160 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.15 * t))
    y = biquad(y, "lowpass", lfo, 1.0) * np.minimum(1, t / 1.0) * np.minimum(1, (sec - t) / 0.4)
    return y * 0.22 * gain


# ------------------------------------------------------------------ arranger
SCALE = [41, 44, 46, 48, 51, 53, 56]  # F minor pentatonic-ish
PROG = [41, 37, 44, 39]  # F, Db, Ab, Eb roots


def render(total, drop, end_hit, bpm=140, build=2.0, out=None, accents=(), breaks=()):
    beat = 60 / bpm
    first = drop - np.ceil(drop / beat) * beat  # grid aligned so `drop` is on a beat
    buf = {k: np.zeros((n(total + 4), 2)) for k in ("drums", "bass", "music", "fx")}
    duck = np.ones(n(total + 4))

    # --- dark part: drone, pulse, ticks, booms
    pre = max(0.0, drop - build)
    if pre > 0.3:
        place(buf["music"], stereo(drone(pre + 0.6), 0), 0)
        i = 0
        tt = first
        while tt < pre:
            if tt >= 0:
                note = [ROOT, ROOT, ROOT + 3, ROOT][i % 4] - 12
                place(buf["music"], stereo(pluck(note, 0.18, 0.55, 900 + 2500 * tt / max(pre, 0.1)), 0.3 if i % 2 else -0.3), tt)
                place(buf["fx"], stereo(tick(0.35 if i % 2 else 0.6), 0), tt)
                if i % 8 == 0:
                    place(buf["drums"], stereo(kick808(ROOT - 12, 1.2, 0.8), 0), tt)
            tt += beat / 2
            i += 1
    # --- build: riser, accelerating snare roll, opening pulse
    if build > 0:
        rs = riser(build + 0.2, 150, 1500)
        place(buf["fx"], rs, drop - build - 0.1, 0.55)
        steps = int(build / beat * 4)
        for k in range(steps):
            tt = drop - build + k * beat / 4
            if k > steps * 0.6 or k % 2 == 0:
                place(buf["drums"], stereo(snare(0.18 + 0.55 * k / steps), 0), tt)
        place(buf["fx"], reverse_swell(1.0), drop - 1.0, 0.7)
    # --- drop: trap
    end = end_hit
    place(buf["fx"], hit(2.5), drop, 0.85)
    place(buf["fx"], sub_drop(), drop, 0.7)
    tt = drop
    k = 0
    from synth import heartbeat
    for a, b in breaks:
        hb = a
        while hb < b - 0.3:
            place(buf["fx"], heartbeat(0.9), hb, 0.8)
            hb += 0.75
        place(buf["fx"], riser(b - a, 120, 1800), a, 0.45)
        place(buf["fx"], hit(2.5), b, 0.85)
        place(buf["fx"], sub_drop(), b, 0.6)
    in_break = lambda x: any(a <= x < b for a, b in breaks)
    while tt < end - 0.01:
        if in_break(tt):
            ti = tt
            place(buf["fx"], stereo(tick(0.5), 0), ti)
            tt += beat / 2
            k += 1
            continue
        bar = k // 8  # 8 eighths per bar
        root = PROG[bar % 4] - 12
        e = k % 8
        # 808 + kick pattern (half-time trap)
        if e in (0, 3) or (e == 6 and bar % 2):
            ln = beat * (1.5 if e == 0 else 1.0)
            place(buf["bass"], stereo(bass808(root, ln, glide_from=root + (12 if e == 6 else 0), gain=0.75), 0), tt)
            place(buf["drums"], stereo(kick808(root, 0.35, 0.6), 0), tt)
            i0 = n(tt)
            dl = n(beat * 0.7)
            env = 1 - 0.6 * np.exp(-np.arange(dl) / SR * 10)
            duck[i0:i0 + dl] = np.minimum(duck[i0:i0 + dl], env[: len(duck[i0:i0 + dl])])
        if e == 4:
            place(buf["drums"], stereo(snare(0.8), 0.05), tt)
        # hats: eighths with rolls
        place(buf["drums"], stereo(hat(False, 0.7), 0.25), tt)
        if e in (5, 7) and bar % 2 == 1:
            for r in range(3):
                place(buf["drums"], stereo(hat(False, 0.5), -0.25), tt + (r + 1) * beat / 6)
        else:
            place(buf["drums"], stereo(hat(False, 0.4), -0.2), tt + beat / 4)
        if e == 6:
            place(buf["drums"], stereo(hat(True, 0.5), 0.1), tt)
        # lead pluck arp
        arp = [0, 3, 7, 10, 12, 10, 7, 3]
        place(buf["music"], stereo(pluck(root + 24 + arp[e], 0.2, 0.42, 6000), 0.35 if e % 2 else -0.35), tt)
        if e == 0 and bar % 2 == 0:
            place(buf["music"], stereo(braam(1.6, root, 0.35)[:, 0], 0), tt)
        tt += beat / 2
        k += 1
    # --- end: braam + hit, ring out
    place(buf["fx"], reverse_swell(0.8), end_hit - 0.8, 0.7)
    place(buf["fx"], hit(3.0, 1.0), end_hit, 0.9)
    place(buf["fx"], braam(3.5, 29, 1.0), end_hit, 0.8)
    for at in accents:
        place(buf["fx"], hit(1.8, 0.6), at, 0.5)

    music = buf["music"] * duck[:, None]
    music = reverb(music, 0.25, 2.2)[: len(duck)]
    mix = buf["drums"] * 0.9 + buf["bass"] * duck[:, None] * 1.0 + music * 0.8 + buf["fx"] * 0.9
    mix = mix[: n(total)]
    f = n(0.6)
    mix[-f:] *= np.linspace(1, 0, f)[:, None]
    mix = limiter(loudness_norm(mix, -15.0), 0.93)
    if out:
        write_wav(out, mix)
    return mix


if __name__ == "__main__":
    import os, sys
    d = sys.argv[1] if len(sys.argv) > 1 else "../public/sfx2"
    os.makedirs(d, exist_ok=True)
    write_wav(f"{d}/braam.wav", braam())
    write_wav(f"{d}/hit.wav", hit())
    write_wav(f"{d}/subdrop.wav", stereo(sub_drop(), 0))
    write_wav(f"{d}/swell.wav", stereo(reverse_swell(), 0))
    write_wav(f"{d}/glass.wav", stereo(glass(), 0))
    write_wav(f"{d}/swish.wav", swish())
    write_wav(f"{d}/whoosh.wav", whoosh(0.5, 300, 6000, 600))
    write_wav(f"{d}/whip.wav", whoosh(0.22, 800, 9000, 2000, -0.9, 0.9))
    write_wav(f"{d}/tick.wav", stereo(normalize(tick(), 0.6), 0))
    print("sfx ok")
