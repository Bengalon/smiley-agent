"""Music beds for the Clutch ads: dark, neon, F minor, built from synthesized parts.

A song is a list of sections. Each section has a length in bars and a set of
active layers, so every ad gets a bed whose drops and breakdowns land exactly
on its visual beats.
"""
import numpy as np
from synth import (SR, RNG, osc, biquad, ramp_exp, reverb, soft_clip, normalize, stereo, place,
                   impact, riser, downlifter, heartbeat, whoosh)

# F minor: i - VI - III - VII  (Fm, Db, Ab, Eb)
PROG = [
    [53, 56, 60, 65],   # F Ab C F
    [49, 53, 56, 61],   # Db F Ab Db
    [56, 60, 63, 68],   # Ab C Eb Ab
    [51, 55, 58, 63],   # Eb G Bb Eb
]
ROOTS = [29, 25, 32, 27]  # F1 Db1 Ab1 Eb1
ARP = [[65, 68, 72, 77], [61, 65, 68, 73], [68, 72, 75, 80], [63, 67, 70, 75]]


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ------------------------------------------------------------ instruments
def kick(gain=1.0):
    n = int(round(0.42 * SR))
    t = np.arange(n) / SR
    f = 46 + 130 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    click = RNG.standard_normal(n) * np.exp(-t * 400) * 0.25
    return soft_clip((body + click) * 1.6, 1.4) * gain


def clap(gain=1.0):
    n = int(round(0.32 * SR))
    t = np.arange(n) / SR
    x = RNG.standard_normal(n)
    env = np.zeros(n)
    for k, at in enumerate([0, 0.011, 0.022]):
        tt = np.clip(t - at, 0, None)
        env += (t >= at) * np.exp(-tt * 180) * (0.7 if k < 2 else 1.0)
    env += np.exp(-np.clip(t - 0.022, 0, None) * 18) * (t >= 0.022) * 0.45
    return biquad(x * env, "bandpass", 1400, 0.9) * 1.8 * gain


def hat(open_=False, gain=1.0):
    n = int(round((0.22 if open_ else 0.05) * SR))
    t = np.arange(n) / SR
    x = biquad(RNG.standard_normal(n), "highpass", 8000) * np.exp(-t * (14 if open_ else 90))
    return x * 0.5 * gain


def sub(note, sec, gain=1.0):
    n = int(round(sec * SR))
    f = mtof(note)
    t = np.arange(n) / SR
    y = osc(f, sec, "sine") + 0.25 * osc(f * 2, sec, "sine")
    env = np.minimum(1, t / 0.01) * np.minimum(1, (sec - t) / 0.03)
    return soft_clip(y * env * 0.9, 1.2) * gain


def supersaw(notes, sec, cutoff=3500, gain=1.0, attack=0.01, release=0.08, voices=5, detune=0.012):
    n = int(round(sec * SR))
    t = np.arange(n) / SR
    L = np.zeros(n)
    R = np.zeros(n)
    for note in notes:
        f = mtof(note)
        for v in range(voices):
            d = (v - (voices - 1) / 2) / ((voices - 1) / 2) if voices > 1 else 0
            s = osc(f * (1 + d * detune), sec, "sawtooth", phase=RNG.random())
            pan = d * 0.8
            L += s * np.cos((pan + 1) * np.pi / 4)
            R += s * np.sin((pan + 1) * np.pi / 4)
    env = np.minimum(1, t / max(attack, 1e-3)) * np.clip((sec - t) / release, 0, 1)
    cut = cutoff if np.ndim(cutoff) == 0 else cutoff[:n]
    L = biquad(L * env, "lowpass", cut, 0.9)
    R = biquad(R * env, "lowpass", cut, 0.9)
    k = gain / (len(notes) * voices) * 2.2
    return np.stack([L, R], axis=1) * k


def pluck(note, sec=0.3, gain=1.0, bright=6000):
    n = int(round(sec * SR))
    t = np.arange(n) / SR
    f = mtof(note)
    s = osc(f, sec, "sawtooth") * 0.6 + osc(f * 1.003, sec, "square") * 0.4
    cut = 300 + bright * np.exp(-t * 18)
    return biquad(s, "lowpass", cut, 1.2) * np.exp(-t * 7) * gain


def pad(notes, sec, gain=1.0, cutoff=1400):
    return supersaw(notes, sec, cutoff=cutoff, gain=gain, attack=min(1.2, sec * 0.4), release=min(1.0, sec * 0.3), voices=4, detune=0.008)


# ---------------------------------------------------------------- arranger
def render_song(sections, bpm, tail=2.5, start_offset=0.0):
    """sections: list of dicts {bars, layers:set, chord_offset?}.

    Layers: kick, kick_half, clap, hats, hats_open, bass, chords, chords_filtered,
    arp, pad, heartbeat, ticks, riser_end, impact_start, downlifter_start, snare_roll.
    """
    beat = 60 / bpm
    bar = beat * 4
    total = sum(s["bars"] for s in sections) * bar + tail + start_offset
    mix = {k: np.zeros((int(round(total * SR)), 2)) for k in ["drums", "bass", "music", "fx"]}
    duck = np.ones(int(round(total * SR)))
    t0 = start_offset
    chord_i = 0
    for s in sections:
        L = s["layers"]
        bars = s["bars"]
        for b in range(int(np.ceil(bars))):
            bt = t0 + b * bar
            frac_bar = min(1.0, bars - b)
            beats_here = int(round(4 * frac_bar))
            ci = (chord_i + b) % 4
            if "chords" in L or "chords_filtered" in L or "pad" in L:
                cut = 6500 if "chords" in L else 1100
                if "pad" in L:
                    place(mix["music"], pad(PROG[ci], bar * frac_bar + 0.3, 1.3, cutoff=1500), bt)
                else:
                    # off-beat stabs (house style) that pump with the kick
                    for k in range(beats_here):
                        st = bt + k * beat + beat * 0.5
                        place(mix["music"], supersaw(PROG[ci], beat * 0.42, cutoff=cut, gain=1.5), st)
                        place(mix["music"], supersaw([n - 12 for n in PROG[ci][:3]], beat * 0.42, cutoff=cut * 0.7, gain=0.7), st)
            if "bass" in L:
                for k in range(beats_here * 2):
                    st = bt + k * beat / 2
                    if k % 2 == 1:
                        place(mix["bass"], sub(ROOTS[ci] + 12, beat * 0.42, 0.42), st)
            if "sub_long" in L:
                place(mix["bass"], sub(ROOTS[ci] + 12, bar * frac_bar, 0.32), bt)
            if "arp" in L:
                for k in range(beats_here * 4):
                    st = bt + k * beat / 4
                    note = ARP[ci][[0, 2, 1, 3, 2, 0, 3, 1][k % 8]] + (12 if k % 16 >= 12 else 0)
                    place(mix["music"], stereo(pluck(note, 0.25, 0.75), 0.35 if k % 2 else -0.35), st)
            for k in range(beats_here):
                st = bt + k * beat
                if "kick" in L or ("kick_half" in L and k % 2 == 0):
                    place(mix["drums"], kick(0.5), st)
                    i = int(round(st * SR))
                    dl = int(beat * 0.85 * SR)
                    env = 1 - 0.75 * np.exp(-np.arange(dl) / SR * 9)
                    duck[i:i + dl] = np.minimum(duck[i:i + dl], env[: len(duck[i:i + dl])])
                if "clap" in L and k % 2 == 1:
                    place(mix["drums"], stereo(clap(0.55), 0.05), st)
                if "hats" in L:
                    place(mix["drums"], stereo(hat(False, 1.1), 0.3), st + beat / 2)
                    if "hats16" in L:
                        place(mix["drums"], stereo(hat(False, 0.6), -0.3), st + beat / 4)
                        place(mix["drums"], stereo(hat(False, 0.6), -0.3), st + 3 * beat / 4)
                if "hats_open" in L and k % 2 == 1:
                    place(mix["drums"], stereo(hat(True, 0.8), -0.2), st + beat / 2)
                if "heartbeat" in L and k % 2 == 0:
                    place(mix["fx"], heartbeat(0.6), st)
                if "ticks" in L:
                    from synth import site_sfx
                    place(mix["fx"], site_sfx("tick") * 0.8, st)
            if "snare_roll" in L and b == int(np.ceil(bars)) - 1:
                steps = 16
                for k in range(steps):
                    st = bt + k * bar / steps
                    place(mix["drums"], stereo(clap(0.25 + 0.6 * k / steps), 0), st)
        if "riser_end" in L:
            dur = min(s["bars"] * bar, s.get("riser_len", 2.0))
            place(mix["fx"], riser(dur), t0 + bars * bar - dur, 0.55)
        if "impact_start" in L:
            place(mix["fx"], impact(), t0, 0.8)
        if "downlifter_start" in L:
            place(mix["fx"], downlifter(), t0, 0.6)
        chord_i += int(np.ceil(bars))
        t0 += bars * bar
    music = mix["music"] * duck[:, None]
    bass = mix["bass"] * duck[:, None]
    music = reverb(music, 0.22, 2.0)[: len(duck)]
    out = mix["drums"] * 0.9 + bass * 1.0 + music * 0.85 + mix["fx"] * 0.9
    out = biquad(out[:, 0], "highpass", 28)[:, None] * [1, 0] + biquad(out[:, 1], "highpass", 28)[:, None] * [0, 1]
    from synth import limiter, loudness_norm
    return limiter(loudness_norm(out, -15.0), 0.93), t0


def final_hit(buf, at, chord=0, gain=0.9):
    """Impact plus a ringing chord to end an ad."""
    place(buf, impact(2.8, 52), at, gain)
    place(buf, supersaw(PROG[chord], 6.0, cutoff=2600, gain=1.6, attack=0.02, release=4.5, voices=4, detune=0.008), at, gain * 0.9)
    return buf
