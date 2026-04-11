#!/usr/bin/env bash
# l1ft0ff // mission voyager // video optimizer for nextelite-blog
# usage: bash tools/optimize-video.sh INPUT.MOV [--mute] [--poster-only]
#
# defaults: re-encode H.264 CRF 23, scale max 1280x720, AAC 128k mono, generate poster
# --mute        strip audio entirely
# --poster-only only generate the poster frame, skip video re-encode

set -euo pipefail

FFMPEG="/opt/homebrew/bin/ffmpeg"

if [ ! -x "$FFMPEG" ]; then
  echo "abort. ffmpeg not found at $FFMPEG" >&2
  exit 1
fi

if [ $# -lt 1 ]; then
  echo "usage: bash tools/optimize-video.sh INPUT.MOV [--mute] [--poster-only]" >&2
  exit 1
fi

INPUT="$1"
shift || true

MUTE=0
POSTER_ONLY=0

for arg in "$@"; do
  case "$arg" in
    --mute) MUTE=1 ;;
    --poster-only) POSTER_ONLY=1 ;;
    *) echo "unknown flag: $arg" >&2; exit 1 ;;
  esac
done

if [ ! -f "$INPUT" ]; then
  echo "abort. input file not found: $INPUT" >&2
  exit 1
fi

# resolve repo root from this script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
VID_DIR="$REPO_ROOT/vid"
IMG_DIR="$REPO_ROOT/img"

mkdir -p "$VID_DIR" "$IMG_DIR"

BASENAME="$(basename "$INPUT")"
STEM="${BASENAME%.*}"
OUT_VIDEO="$VID_DIR/${STEM}.mp4"
OUT_POSTER="$IMG_DIR/${STEM}-poster.jpg"

# input stats
IN_BYTES=$(stat -f%z "$INPUT" 2>/dev/null || stat -c%s "$INPUT")
IN_HUMAN=$(awk -v b="$IN_BYTES" 'BEGIN { printf "%.1fMB", b/1048576 }')

# duration via ffprobe-less trick (ffmpeg stderr parsing is ugly, use ffprobe if present)
FFPROBE="/opt/homebrew/bin/ffprobe"
DURATION="unknown"
if [ -x "$FFPROBE" ]; then
  DURATION=$("$FFPROBE" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT" 2>/dev/null | awk '{ printf "%.1fs", $1 }')
fi

# always generate poster frame at t=0
"$FFMPEG" -y -loglevel error -ss 0 -i "$INPUT" -frames:v 1 -q:v 3 "$OUT_POSTER"

if [ "$POSTER_ONLY" -eq 1 ]; then
  POSTER_BYTES=$(stat -f%z "$OUT_POSTER" 2>/dev/null || stat -c%s "$OUT_POSTER")
  POSTER_HUMAN=$(awk -v b="$POSTER_BYTES" 'BEGIN { printf "%.0fKB", b/1024 }')
  echo "voyager // poster-only // in=${IN_HUMAN} dur=${DURATION} poster=${POSTER_HUMAN} path=${OUT_POSTER}"
  exit 0
fi

# audio args
if [ "$MUTE" -eq 1 ]; then
  AUDIO_ARGS=(-an)
else
  AUDIO_ARGS=(-c:a aac -b:a 128k -ac 1)
fi

# video encode: H.264, preset medium, CRF 23, scale to fit inside 1280x720 keeping aspect
"$FFMPEG" -y -loglevel error -i "$INPUT" \
  -c:v libx264 -preset medium -crf 23 \
  -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  -movflags +faststart \
  "${AUDIO_ARGS[@]}" \
  "$OUT_VIDEO"

OUT_BYTES=$(stat -f%z "$OUT_VIDEO" 2>/dev/null || stat -c%s "$OUT_VIDEO")
OUT_HUMAN=$(awk -v b="$OUT_BYTES" 'BEGIN { printf "%.1fMB", b/1048576 }')

# warn if over 50MB (github pages is 100MB hard cap)
OUT_MB=$(( OUT_BYTES / 1048576 ))
WARN=""
if [ "$OUT_MB" -gt 50 ]; then
  WARN=" WARN:over50MB"
fi
if [ "$OUT_MB" -gt 100 ]; then
  WARN=" ABORT:over100MB-github-pages-limit"
fi

echo "voyager // in=${IN_HUMAN} out=${OUT_HUMAN} dur=${DURATION} video=${OUT_VIDEO} poster=${OUT_POSTER}${WARN}"
