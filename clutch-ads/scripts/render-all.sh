#!/usr/bin/env bash
# Renders every ad, then masters the audio (limiter + loudness to -14 LUFS, true peak -1 dB).
# Usage: scripts/render-all.sh [compositionId ...]
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/raw out/final
IDS=("$@")
if [ ${#IDS[@]} -eq 0 ]; then
  IDS=(Clutch-Short-14s Clutch-TwoPlayers-20s Clutch-Challenge-20s Clutch-Manifesto-33s Clutch-Story-44s)
fi
for id in "${IDS[@]}"; do
  echo "== rendering $id"
  npx remotion render "$id" "out/raw/$id.mp4" --gl=swangle --concurrency=4 --crf=17 --audio-bitrate=320k
  ffmpeg -v error -y -i "out/raw/$id.mp4" -c:v copy \
    -af "alimiter=limit=0.9:attack=4:release=60:level=disabled,loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000" \
    -c:a aac -b:a 256k -movflags +faststart "out/final/$id.mp4"
  echo "== done $id"
done
