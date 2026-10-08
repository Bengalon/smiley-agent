"""Small offline synth used to render the Clutch ad sound design.

Everything here is generated from code (no samples), so the music and effects
are original and royalty free. The game sound effects are ports of the Web
Audio recipes in the Clutch site (Sfx.play in app.js), so the ads sound like
the product.
"""
import numpy as np
from scipy.signal import lfilter, fftconvolve, butter, sosfilt

SR = 48000
RNG = np.random.default_rng(7)


# ---------------------------------------------------------------- primitives
def silence(sec):
    return np.zeros(int(round(sec * SR)))


def t_axis(sec):
    return np.arange(int(round(sec * SR))) / SR


def exp_env(n, attack=0.006, start=1.0, end=1e-4):
    """Web Audio style: exponential ramp 0.0001 -> 1 over attack, then down to 1e-4."""
    t = np.arange(n) / SR
    d = n / SR
    a = max(attack, 1e-4)
    env = np.empty(n)
    m = t < a
    env[m] = 1e-4 * (start / 1e-4) ** (t[m] / a)
    rest = ~m
    env[rest] = start * (end / start) ** ((t[rest] - a) / max(d - a, 1e-4))
    return env


def osc(freq, sec, kind="sine", phase=0.0):
    """freq can be a scalar or an array (per-sample frequency)."""
    if np.ndim(freq) == 0:
        n = int(round(sec * SR))
        f = np.full(n, float(freq))
    else:
        f = np.asarray(freq, dtype=float)
    ph = (np.cumsum(f) / SR + phase) % 1.0
    if kind == "sine":
        return np.sin(2 * np.pi * ph)
    if kind == "square":
        return np.where(ph < 0.5, 1.0, -1.0)
    if kind == "sawtooth":
        return 2 * ph - 1
    if kind == "triangle":
        return 1 - 4 * np.abs(ph - 0.5)
    raise ValueError(kind)


def biquad(x, kind, freq, q=0.707, gain_db=0.0):
    """RBJ biquad. freq may be scalar or per-sample array (processed in blocks)."""
    def coefs(f):
        f = float(np.clip(f, 10, SR * 0.45))
        w = 2 * np.pi * f / SR
        cw, sw = np.cos(w), np.sin(w)
        alpha = sw / (2 * q)
        if kind == "lowpass":
            b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]
            a = [1 + alpha, -2 * cw, 1 - alpha]
        elif kind == "highpass":
            b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]
            a = [1 + alpha, -2 * cw, 1 - alpha]
        elif kind == "bandpass":
            b = [alpha, 0, -alpha]
            a = [1 + alpha, -2 * cw, 1 - alpha]
        elif kind == "peak":
            A = 10 ** (gain_db / 40)
            b = [1 + alpha * A, -2 * cw, 1 - alpha * A]
            a = [1 + alpha / A, -2 * cw, 1 - alpha / A]
        else:
            raise ValueError(kind)
        return np.array(b) / a[0], np.array(a) / a[0]

    if np.ndim(freq) == 0:
        b, a = coefs(freq)
        return lfilter(b, a, x)
    out = np.empty_like(x)
    zi = np.zeros(2)
    blk = 64
    for i in range(0, len(x), blk):
        b, a = coefs(freq[min(i, len(freq) - 1)])
        seg, zi = lfilter(b, a, x[i:i + blk], zi=zi)
        out[i:i + blk] = seg
    return out


def ramp_exp(f0, f1, sec, n=None):
    n = n or int(round(sec * SR))
    return f0 * (f1 / f0) ** (np.arange(n) / max(n - 1, 1))


def noise(sec):
    return RNG.uniform(-1, 1, int(round(sec * SR)))


def place(buf, clip, at, gain=1.0):
    """Mix a mono or stereo clip into a stereo buffer at time `at` (seconds)."""
    i = int(round(at * SR))
    if clip.ndim == 1:
        clip = np.stack([clip, clip], axis=1)
    if i < 0:
        clip = clip[-i:]
        i = 0
    j = min(len(buf), i + len(clip))
    if j > i:
        buf[i:j] += clip[: j - i] * gain
    return buf


def stereo(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l * 1.414, x * r * 1.414], axis=1)


def reverb_ir(sec=2.2, damp=4500, seed=3):
    rng = np.random.default_rng(seed)
    n = int(round(sec * SR))
    t = np.arange(n) / SR
    env = np.exp(-t * 6.9 / sec)
    ir = np.stack([rng.standard_normal(n) * env, rng.standard_normal(n) * env], axis=1)
    sos = butter(2, damp, "low", fs=SR, output="sos")
    ir = sosfilt(sos, ir, axis=0)
    ir[: int(round(0.012 * SR))] *= np.linspace(0, 1, int(round(0.012 * SR)))[:, None]
    return ir / np.sqrt((ir ** 2).sum(axis=0)).max()


_IR = None


def reverb(x, mix=0.25, sec=2.2):
    global _IR
    if _IR is None or len(_IR) != int(round(sec * SR)):
        _IR = reverb_ir(sec)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    wet = np.stack([fftconvolve(x[:, 0], _IR[:, 0]), fftconvolve(x[:, 1], _IR[:, 1])], axis=1)
    out = np.zeros((len(wet), 2))
    out[: len(x)] += x * (1 - mix * 0.5)
    out += wet * mix
    return out


def soft_clip(x, drive=1.0):
    return np.tanh(x * drive) / np.tanh(drive)


def normalize(x, peak=0.89):
    m = np.abs(x).max()
    return x * (peak / m) if m > 0 else x


def write_wav(path, x):
    import wave
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    y = np.clip(x, -1, 1)
    pcm = (y * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ------------------------------------------------- site sound effect ports
def tone(f, d, kind="sine", g=0.1, at=0.0, to=None):
    n = int(round((d + 0.03) * SR))
    freq = ramp_exp(f, to, d, n) if to else f
    sig = osc(freq, n / SR, kind)
    env = exp_env(int(round(d * SR)), 0.006, g)
    env = np.concatenate([env, np.zeros(n - len(env))])
    return at, sig * env


def nz(d, g=0.08, kind="highpass", freq=2000, at=0.0, f2=None):
    n = max(1, int(round(d * SR)))
    x = RNG.uniform(-1, 1, n) * (1 - np.arange(n) / n) ** 2.5
    fr = ramp_exp(freq, f2, d, n) if f2 else freq
    q = 1.4 if kind == "bandpass" else 0.7
    return at, biquad(x, kind, fr, q) * g


def site_bus(parts, tail=0.6):
    """Mix (at, clip) parts and run them through the site's dry + feedback delay bus."""
    end = max(at + len(c) / SR for at, c in parts) + tail
    x = np.zeros(int(round(end * SR)))
    for at, c in parts:
        i = int(round(at * SR))
        x[i:i + len(c)] += c
    dry = x * 0.9
    D = int(round(0.11 * SR))
    d = np.zeros_like(x)
    for i in range(D, len(x), D):
        seg = x[i - D:i] + 0.26 * d[i - D:i]
        d[i:i + D] = seg[: len(d[i:i + D])]
    wet = biquad(d, "lowpass", 3600) * 0.18
    y = dry + wet
    # light compressor stand-in
    return soft_clip(y * 2.2, 1.2)


def site_sfx(name, rng=None):
    T, N = tone, nz
    rng = rng or RNG
    p = []
    if name == "tap":
        p = [T(1500, 0.04, "triangle", 0.04)]
    elif name == "clack":
        p = [N(0.045, 0.16, "highpass", 2800), T(2600, 0.03, "sine", 0.03)]
    elif name == "deal":
        p = [N(0.14, 0.09, "bandpass", 3400, 0, 900)]
    elif name == "flip":
        p = [N(0.035, 0.14, "highpass", 4600), T(1900, 0.03, "triangle", 0.03)]
    elif name == "first":
        p = [T(1200, 0.12, "sine", 0.07, 0, 2600), T(2600, 0.09, "triangle", 0.03, 0.06)]
    elif name == "oppfirst":
        p = [T(420, 0.16, "sawtooth", 0.035, 0, 250), N(0.08, 0.04, "lowpass", 900)]
    elif name == "good":
        p = [T(f, 0.3, "triangle", 0.06, i * 0.025) for i, f in enumerate([1047, 1319, 1568])] + [T(2093, 0.22, "sine", 0.03, 0.06)]
    elif name == "bad":
        p = [T(160, 0.34, "sawtooth", 0.05, 0, 80), T(167, 0.34, "sawtooth", 0.05, 0, 84), N(0.16, 0.05, "lowpass", 700)]
    elif name == "roundwin":
        p = [T(f, 0.2, "triangle", 0.07, i * 0.07) for i, f in enumerate([784, 988, 1175, 1568])] + [N(0.45, 0.035, "highpass", 6500, 0.24)]
    elif name == "roundlose":
        p = [T(330, 0.22, "triangle", 0.07), T(262, 0.42, "triangle", 0.07, 0.15)]
    elif name == "streak":
        p = [T(f, 0.12, "square", 0.018, i * 0.05) for i, f in enumerate([1319, 1568, 2093, 2637])]
    elif name == "tick":
        p = [T(1250, 0.06, "sine", 0.06, 0, 700)]
    elif name == "beat":
        p = [T(62, 0.18, "sine", 0.5), T(54, 0.2, "sine", 0.4, 0.2)]
    elif name == "count":
        p = [T(520, 0.1, "triangle", 0.08)]
    elif name == "match":
        p = [T(f, 0.2, "triangle", 0.06, i * 0.07) for i, f in enumerate([392, 523, 659, 784])]
    elif name == "win":
        p = [T(f, 0.3, "triangle", 0.08, i * 0.08) for i, f in enumerate([523, 659, 784, 1047, 1319, 1568])] + [N(0.7, 0.03, "highpass", 7000, 0.45)]
    elif name == "lose":
        p = [T(392, 0.3, "triangle", 0.08), T(311, 0.5, "triangle", 0.08, 0.22), T(233, 0.6, "triangle", 0.06, 0.5)]
    elif name == "coin":
        p = [T(1900 + rng.random() * 700, 0.07, "sine", 0.035), T(3900 + rng.random() * 900, 0.05, "sine", 0.012, 0.02)]
    else:
        raise ValueError(name)
    return site_bus(p)


# ------------------------------------------------------ cinematic effects
def whoosh(sec=0.55, f0=300, f1=5000, f2=700, pan_from=-0.7, pan_to=0.7):
    n = int(round(sec * SR))
    x = RNG.standard_normal(n)
    half = n // 2
    fr = np.concatenate([ramp_exp(f0, f1, 0, half), ramp_exp(f1, f2, 0, n - half)])
    y = biquad(x, "bandpass", fr, 1.1)
    t = np.linspace(0, 1, n)
    env = np.sin(np.pi * t) ** 2.2
    y = y * env
    pans = np.linspace(pan_from, pan_to, n)
    l = np.cos((pans + 1) * np.pi / 4)
    r = np.sin((pans + 1) * np.pi / 4)
    return normalize(np.stack([y * l, y * r], axis=1), 0.7)


def impact(sec=2.2, sub=58, weight=1.0):
    n = int(round(sec * SR))
    t = np.arange(n) / SR
    f = sub * 1.9 * np.exp(-t * 30) + sub * 0.62
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6)
    click = biquad(RNG.standard_normal(n) * np.exp(-t * 60), "lowpass", 3000) * 0.6
    crack = biquad(RNG.standard_normal(n) * np.exp(-t * 14), "bandpass", 1800, 0.8) * 0.35
    y = soft_clip(body * 1.4 * weight + click + crack, 1.5)
    return normalize(reverb(y, 0.35, 2.4)[:n], 0.95)


def riser(sec=2.5, f0=180, f1=1400):
    n = int(round(sec * SR))
    t = np.linspace(0, 1, n)
    x = RNG.standard_normal(n)
    hp = biquad(x, "bandpass", ramp_exp(400, 9000, 0, n), 0.9) * t ** 2
    pitch = ramp_exp(f0, f1, 0, n)
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(ramp_exp(4, 22, 0, n)) / SR)
    sw = (osc(pitch, sec, "sawtooth") + osc(pitch * 1.006, sec, "sawtooth")) * 0.25
    sw = biquad(sw, "lowpass", ramp_exp(500, 7000, 0, n)) * t ** 1.6 * trem
    y = hp * 0.6 + sw
    out = reverb(y, 0.3)[:n]
    return normalize(out, 0.8)


def downlifter(sec=1.4):
    n = int(round(sec * SR))
    t = np.linspace(0, 1, n)
    x = biquad(RNG.standard_normal(n), "bandpass", ramp_exp(7000, 300, 0, n), 0.8) * (1 - t) ** 1.5
    return normalize(reverb(x, 0.4)[:n], 0.6)


def heartbeat(gain=1.0):
    n = int(round(0.75 * SR))
    t = np.arange(n) / SR
    def thump(at, f, g):
        tt = np.clip(t - at, 0, None)
        on = (t >= at).astype(float)
        fr = f * (1 + 1.2 * np.exp(-tt * 40))
        s = np.sin(2 * np.pi * np.cumsum(fr * on) / SR) * np.exp(-tt * 14) * on
        return s * g
    y = thump(0, 55, 1.0) + thump(0.22, 48, 0.8)
    y = biquad(y, "lowpass", 160) * 2.2
    return normalize(soft_clip(y, 1.6), 0.95 * gain)


def coins_cascade(sec=1.4, count=16, seed=11):
    rng = np.random.default_rng(seed)
    out = np.zeros((int(round((sec + 0.8) * SR)), 2))
    for k in range(count):
        at = sec * (k / count) ** 1.3 + rng.random() * 0.03
        c = site_sfx("coin", rng)
        place(out, stereo(c, rng.uniform(-0.6, 0.6)), at, 0.9)
    return normalize(out, 0.7)


def pop(sec=0.18):
    n = int(round(sec * SR))
    t = np.arange(n) / SR
    y = biquad(RNG.standard_normal(n) * np.exp(-t * 45), "bandpass", 2500, 1.2)
    y += np.sin(2 * np.pi * np.cumsum(ramp_exp(500, 1800, 0, n)) / SR) * np.exp(-t * 30) * 0.6
    return normalize(y, 0.6)


def glitch(sec=0.5, seed=5):
    rng = np.random.default_rng(seed)
    out = np.zeros(int(round(sec * SR)))
    i = 0
    while i < len(out):
        L = int(rng.uniform(0.01, 0.05) * SR)
        f = rng.choice([80, 160, 320, 640, 1280, 2560]) * rng.uniform(0.9, 1.1)
        kind = rng.choice(["square", "sawtooth"])
        seg = osc(f, L / SR, kind) * rng.uniform(0.2, 0.7)
        if rng.random() < 0.35:
            seg = RNG.uniform(-1, 1, L) * 0.5
        out[i:i + L] = seg[: len(out[i:i + L])]
        i += L + int(rng.uniform(0, 0.02) * SR)
    return normalize(biquad(out, "lowpass", 6000), 0.55)


def slot_spin(sec=2.0, seed=2):
    """Mechanical reel clicks slowing down, for the 'luck' scene."""
    rng = np.random.default_rng(seed)
    out = np.zeros(int(round((sec + 0.5) * SR)))
    t = 0.0
    gap = 0.035
    while t < sec:
        n = int(round(0.02 * SR))
        tt = np.arange(n) / SR
        c = biquad(rng.standard_normal(n) * np.exp(-tt * 260), "bandpass", rng.uniform(2500, 3500), 2) * 0.8
        i = int(round(t * SR))
        out[i:i + n] += c[: len(out[i:i + n])]
        t += gap
        gap *= 1.045
    return normalize(out, 0.5)


def bell_ding(f=1568):
    n = int(round(1.6 * SR))
    t = np.arange(n) / SR
    y = sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) * a for m, d, a in [(1, 3, 1), (2.76, 5, 0.5), (5.4, 8, 0.25), (8.9, 12, 0.12)])
    return normalize(reverb(y, 0.3)[:n], 0.5)


def tape_stop(sec=0.9):
    """A falling-pitch 'power down' used when luck gets switched off."""
    n = int(round(sec * SR))
    f = ramp_exp(420, 30, 0, n)
    y = (osc(f, sec, "sawtooth") + osc(f * 1.5, sec, "square") * 0.4) * np.linspace(1, 0, n) ** 0.7
    return normalize(biquad(y, "lowpass", ramp_exp(4000, 200, 0, n)), 0.6)


def limiter(x, ceiling=0.95, release=0.08, look=0.004):
    """Look-ahead peak limiter (stereo array)."""
    from scipy.ndimage import maximum_filter1d
    peak = np.abs(x).max(axis=1)
    w = max(1, int(look * SR))
    peak = maximum_filter1d(peak, size=2 * w + 1)
    g = np.minimum(1.0, ceiling / np.maximum(peak, 1e-9))
    a = np.exp(-1 / (release * SR))
    # instant attack, smooth release
    gs = np.empty_like(g)
    prev = 1.0
    gl = g.tolist()
    for i, v in enumerate(gl):
        prev = v if v < prev else v + (prev - v) * a
        gs[i] = prev
    return x * gs[:, None]


def loudness_norm(x, target_db=-16.0):
    rms = np.sqrt((x ** 2).mean())
    return x * (10 ** (target_db / 20) / max(rms, 1e-9))
