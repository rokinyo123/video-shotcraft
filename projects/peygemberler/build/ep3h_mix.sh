#!/bin/bash
# EP3 giriş son miks: klip səsləri + fon musiqisi VO altında sidechain ilə enir, sonra -14 LUFS
set -e; cd "$(dirname "$0")/.."
ffmpeg -v error -y -i out/ep3h_raw.mp4 -i public/audio/ep3/bed.wav -i public/vo/ep3/ses_giris.mp3 -i public/audio/ep3/sfx_hybrid.wav -filter_complex "\
[0:a]aresample=48000,volume=1.0[clips];[1:a]aresample=48000[bed];\
[3:a]aresample=48000[pfx];[clips][bed][pfx]amix=inputs=3:normalize=0[mus];\
[2:a]aresample=48000,pan=stereo|c0=c0|c1=c0,asplit=2[vo][key];\
[mus][key]sidechaincompress=threshold=0.04:ratio=5:attack=25:release=350:makeup=1[duck];\
[duck][vo]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=11[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/giris_hibrit.mp4
