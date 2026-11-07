"""Builds the film's sound and captions from recorded narration, and replaces public/media/demo.mp4's sound.

The picture is kept as it is. The narration is one recording per line, made in ElevenLabs with the
voice "Itamar - Israeli Hebrew Narrator" (Eleven v3) on a paid plan, so it may be used commercially.
Put them in .audio-build/voice/ as line1.mp3, line2.mp3 and so on, in the order of LINES. Each line
starts at its time below and must end before the next one starts. The film opens with three seconds
of logo before the first line. The music is the track in .audio-build/music-source.m4a ("Confident
Launch"); check that its licence allows commercial use.

    python -m venv .venv && .venv/Scripts/python -m pip install numpy
    .venv/Scripts/python scripts/make_film_audio.py
"""
import json
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / ".audio-build"
OUT.mkdir(exist_ok=True)
MEDIA = ROOT / "public/media"
PICTURE = MEDIA / "demo.mp4"
VOICE = OUT / "voice"
DURATION = 63.0
# the music: a 60-second track, stretched slightly to the film's length
MUSIC = OUT / "music-source.m4a"

# start (s), the captions (what the recording says)
LINES = [
    (3.3, "הלקוחות שלכם נכנסים לסופר, גם כשהם קונים אונליין. הכירו את Virtual-Shop."),
    (9.3, "חוויית קנייה שמזמינה לשוטט בין המדפים, לגלות מוצרים ולבחור מה להוסיף לעגלה."),
    (17.6, "אפשר גם ליצור חנות לפי העדפות קנייה. למשל, חנות טבעונית שמציגה מוצרים מתאימים מתוך הקטלוג שלכם, עם מחלקות שמשתנות בהתאם."),
    (29.3, "המבצעים והמוצרים שחשובים לכם מקבלים מקום בולט בחנות, בלוחות מבצעים ובתצוגות לאורך מסלול הקנייה."),
    (38.4, "וכשהלקוח יודע מה הוא צריך, החיפוש מוביל אותו ישר למדף ולמוצר."),
    (46.3, "החוויה מותאמת לקטלוג ולמיתוג שלכם. במסגרת הפיילוט נבחן גם את החיבור לעגלת האונליין של הרשת."),
    (55.6, "מתחילים בפיילוט ממוקד בקטגוריה אחת. בואו נראה איך זה יכול לעבוד ברשת שלכם."),
]


def run(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def seconds(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout)


def voice_file(i):
    path = VOICE / f"line{i + 1}.mp3"
    if not path.exists():
        raise SystemExit(f"missing {path}")
    return path


def make_music(path, length=DURATION, sr=44100):
    """A soft original bed: warm pad, quiet bass and a gentle pluck, over four repeating chords."""
    n = int(length * sr)
    t = np.arange(n) / sr
    left = np.zeros(n)
    right = np.zeros(n)
    beat = 60 / 84
    bar = beat * 4
    chords = [
        [130.81, 196.00, 246.94, 329.63],  # Cmaj7
        [110.00, 164.81, 261.63, 329.63],  # Am7
        [87.31, 174.61, 261.63, 349.23],  # Fmaj7
        [98.00, 196.00, 246.94, 293.66],  # G
    ]
    pluck_steps = [0, 2, 3, 2, 1, 3, 2, 3]
    rng = np.random.default_rng(7)
    for k in range(int(length / (bar * 2)) + 1):
        chord = chords[k % 4]
        start = k * bar * 2
        i0 = int(start * sr)
        size = min(n - i0, int((bar * 2 + 1.5) * sr))
        if size <= 0:
            break
        local = np.arange(size) / sr
        # pad: slow swell, a little detune between the ears
        env = np.minimum(local / 1.2, 1) * np.minimum((bar * 2 + 1.5 - local) / 1.5, 1)
        for f in chord[1:]:
            for detune, ear in ((0.997, left), (1.003, right)):
                tone = np.sin(2 * np.pi * f * detune * local) + 0.25 * np.sin(4 * np.pi * f * detune * local)
                ear[i0 : i0 + size] += 0.055 * env * tone
        # bass
        bass_env = np.minimum(local / 0.08, 1) * np.exp(-local / 2.2)
        bass = 0.13 * bass_env * np.sin(2 * np.pi * chord[0] * local)
        left[i0 : i0 + size] += bass
        right[i0 : i0 + size] += bass
        # pluck: eighth notes, an octave up
        for step in range(16):
            at = start + step * beat / 2
            j0 = int(at * sr)
            m = min(n - j0, int(1.3 * sr))
            if m <= 0:
                continue
            lt = np.arange(m) / sr
            f = chord[pluck_steps[step % 8]] * 2
            gain = 0.05 * (0.8 + 0.2 * rng.random())
            note = gain * np.exp(-lt / 0.38) * (np.sin(2 * np.pi * f * lt) + 0.3 * np.sin(4 * np.pi * f * lt))
            pan = 0.5 + 0.28 * np.sin(step * 1.7)
            left[j0 : j0 + m] += note * (1 - pan)
            right[j0 : j0 + m] += note * pan
    # a simple echo for space
    delay = int(beat * 0.75 * sr)
    for ear, other in ((left, right), (right, left)):
        ear[delay:] += 0.22 * other[:-delay].copy()
    fade = np.minimum(np.minimum(t / 2.0, (length - t) / 3.5), 1)
    fade = np.clip(fade, 0, 1)
    stereo = np.stack([left * fade, right * fade], axis=1)
    stereo = stereo / np.abs(stereo).max() * 0.8
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((stereo * 32767).astype("<i2").tobytes())


def vtt_time(s):
    m, sec = divmod(s, 60)
    return f"00:{int(m):02d}:{sec:06.3f}"



timing = []
ok = True
for i, (start, caption) in enumerate(LINES):
    length = seconds(voice_file(i))
    end = start + length
    limit = LINES[i + 1][0] if i + 1 < len(LINES) else DURATION
    fits = end <= limit - 0.1
    ok = ok and fits
    timing.append({"line": i, "start": start, "end": round(end, 2), "limit": limit, "fits": fits})
print(json.dumps(timing, indent=0))
if not ok:
    print("LINES OVERLAP: retime before mixing")
    sys.exit(2)

# captions
vtt = ["WEBVTT", ""]
for t, (_, caption) in zip(timing, LINES):
    vtt += [f"{vtt_time(t['start'])} --> {vtt_time(t['end'])}", caption, ""]
(OUT / "demo.he.vtt").write_text("\n".join(vtt), encoding="utf-8")

# the voice track: every line at its own moment
inputs = []
delays = []
for i, (start, _) in enumerate(LINES):
    inputs += ["-i", str(voice_file(i))]
    delays.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,adelay={int(start * 1000)}:all=1[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(LINES)))
graph = ";".join(delays) + f";{mix}amix=inputs={len(LINES)}:normalize=0,apad,atrim=0:{DURATION}[v]"
run(*inputs, "-filter_complex", graph, "-map", "[v]", str(OUT / "voice.wav"))

if MUSIC.exists():
    src_len = seconds(MUSIC)
    run("-i", str(MUSIC), "-af",
        f"atempo={src_len / DURATION:.5f},afade=t=in:st=0:d=0.3,afade=t=out:st={DURATION - 2.5}:d=2.5,"
        f"aresample=44100,aformat=channel_layouts=stereo,apad,atrim=0:{DURATION}",
        str(OUT / "music.wav"))
else:
    make_music(OUT / "music.wav")

# the music sits low and dips further under the voice
def mean_db(path, seek=None, length=None):
    args = ["ffmpeg", "-hide_banner"]
    if seek is not None:
        args += ["-ss", str(seek), "-t", str(length)]
    args += ["-i", str(path), "-af", "volumedetect", "-f", "null", "-"]
    err = subprocess.run(args, capture_output=True, text=True).stderr
    return float(err.split("mean_volume:")[1].split("dB")[0])


# fixed gains, no dynamic levelling: speech near -18 dB, music about 15 dB below it, less under speech
voice_gain = -18 - mean_db(OUT / "voice.wav", 9.5, 5)
music_gain = -30 - mean_db(OUT / "music.wav", 10, 40)
print("gains", round(voice_gain, 1), round(music_gain, 1))
graph = (
    f"[0:a]volume={voice_gain}dB,asplit=2[voice][key];"
    f"[1:a]volume={music_gain}dB[bed];"
    "[bed][key]sidechaincompress=threshold=0.03:ratio=3:attack=80:release=800[ducked];"
    "[voice][ducked]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.84:level=false[mix]"
)
run("-i", str(OUT / "voice.wav"), "-i", str(OUT / "music.wav"), "-filter_complex", graph, "-map", "[mix]",
    str(OUT / "mix.wav"))

run("-i", str(PICTURE), "-i", str(OUT / "mix.wav"), "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(OUT / "demo.mp4"))
shutil.copy(OUT / "demo.mp4", MEDIA / "demo.mp4")
shutil.copy(OUT / "demo.he.vtt", MEDIA / "demo.he.vtt")
print("built", (MEDIA / "demo.mp4").stat().st_size)
