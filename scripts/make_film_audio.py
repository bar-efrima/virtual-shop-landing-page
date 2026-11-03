"""Builds the film's narration, music and captions, and replaces public/media/demo.mp4's sound.

The picture is kept as it is. To change the words, edit LINES; a line must end before the next starts.
Delete .audio-build/ after changing the words or the voice, or the old lines are reused.

    python -m venv .venv && .venv/Scripts/python -m pip install edge-tts numpy
    .venv/Scripts/python scripts/make_film_audio.py he-IL-HilaNeural   (or he-IL-AvriNeural)
"""
import asyncio
import json
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import edge_tts
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / ".audio-build"
OUT.mkdir(exist_ok=True)
MEDIA = ROOT / "public/media"
PICTURE = MEDIA / "demo.mp4"
VOICE = sys.argv[1] if len(sys.argv) > 1 else "he-IL-HilaNeural"
DURATION = 65.867

# start (s), what is spoken, what the captions show, speaking-rate adjustment
LINES = [
    (0.6, "וירצ'ואל שופ.", "Virtual-Shop.", "+0%"),
    (4.2, "הסופר שלכם, חוויית קנייה ייחודית, ישר מהדפדפן.", "הסופר שלכם, חוויית קנייה ייחודית, ישר מהדפדפן.", "+0%"),
    (9.7, "המבצעים מחכים כבר בכניסה.", "המבצעים מחכים כבר בכניסה.", "+0%"),
    (12.85, "מעברים ומדפים, כמו בסניף.", "מעברים ומדפים, כמו בסניף.", "+0%"),
    (16.5, "בוחרים מוצר מהמדף, לפי כמות או משקל.", "בוחרים מוצר מהמדף, לפי כמות או משקל.", "+0%"),
    (21.5, "נוסעים עם העגלה בין המעברים, ומסתכלים לכל הכיוונים.", "נוסעים עם העגלה בין המעברים, ומסתכלים לכל הכיוונים.", "+0%"),
    (30.7, "כל מוצר נוחת בסל, בתלת ממד.", "כל מוצר נוחת בסל, בתלת־ממד.", "+0%"),
    (35.0, "מחפשים משהו? מקלידים את שם המוצר, והעגלה נוסעת אליו לבד.", "מחפשים משהו? מקלידים את שם המוצר, והעגלה נוסעת אליו לבד.", "+0%"),
    (47.0, "ואפשר לעבור לסופר בהתאמה אישית: טבעוני, צמחוני, ללא חלב, או ללא בוטנים ואגוזים.", "ואפשר לעבור לסופר בהתאמה אישית: טבעוני, צמחוני, ללא חלב, או ללא בוטנים ואגוזים.", "+0%"),
    (55.05, "הסל עובר לקופה של הרשת. החיבור כפוף לבדיקה טכנית.", "הסל עובר לקופה של הרשת. החיבור כפוף לבדיקה טכנית.", "+0%"),
    (61.1, "וירצ'ואל שופ. בואו נראה לכם את החנות.", "Virtual-Shop. בואו נראה לכם את החנות.", "+0%"),
]


def run(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def seconds(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout)


async def speak():
    for i, (_, text, _, rate) in enumerate(LINES):
        path = OUT / f"line{i:02d}.mp3"
        if path.exists() and path.stat().st_size > 0:
            continue
        for attempt in range(5):
            try:
                await asyncio.wait_for(edge_tts.Communicate(text, VOICE, rate=rate).save(str(path)), timeout=30)
                if path.stat().st_size > 0:
                    break
            except Exception as e:
                print("retry", i, attempt, type(e).__name__, flush=True)
            await asyncio.sleep(3 * (attempt + 1))
        else:
            raise SystemExit(f"line {i} could not be generated")


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


asyncio.run(speak())

timing = []
ok = True
for i, (start, _, caption, _) in enumerate(LINES):
    length = seconds(OUT / f"line{i:02d}.mp3")
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
for t, (_, _, caption, _) in zip(timing, LINES):
    vtt += [f"{vtt_time(t['start'])} --> {vtt_time(t['end'])}", caption, ""]
(OUT / "demo.he.vtt").write_text("\n".join(vtt), encoding="utf-8")

# the voice track: every line at its own moment
inputs = []
delays = []
for i, (start, *_ ) in enumerate(LINES):
    inputs += ["-i", str(OUT / f"line{i:02d}.mp3")]
    delays.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,adelay={int(start * 1000)}:all=1[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(LINES)))
graph = ";".join(delays) + f";{mix}amix=inputs={len(LINES)}:normalize=0,apad,atrim=0:{DURATION}[v]"
run(*inputs, "-filter_complex", graph, "-map", "[v]", str(OUT / "voice.wav"))

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
voice_gain = -18 - mean_db(OUT / "voice.wav", 21.6, 4.8)
music_gain = -33 - mean_db(OUT / "music.wav", 10, 40)
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
