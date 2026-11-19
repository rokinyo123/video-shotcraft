#!/bin/bash
# EP3 · Bölüm 2 son miks: musiqi VO altında sidechain ilə enir, -14 LUFS, -1 dB pik
set -e; cd "$(dirname "$0")/.."
ffmpeg -v error -y -i out/ep3b_raw.mp4 -i public/audio/ep3/bed_b2.wav -i public/vo/ep3/bolum2.mp3 -filter_complex "\
[1:a]aresample=48000[mus];\
[2:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=0|0,asplit=2[vo][key];\
[mus][key]sidechaincompress=threshold=0.04:ratio=5:attack=25:release=350[duck];\
[duck][vo]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=11[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/bolum2_final.mp4
