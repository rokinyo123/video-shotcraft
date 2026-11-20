#!/bin/bash
# EP3 · Bölüm 3: klip səsləri (çəkic, heyvanlar, gəmi) + təbii səslər/keçidlər. Musiqi və səsləndirmə YOX.
# Səviyyə aşağı saxlanır (≈ -24 LUFS, pik ≤ -3 dB) ki, istifadəçinin səsi üstə rahat otursun.
set -e; cd "$(dirname "$0")/.."
ffmpeg -v error -y -i out/ep3p3_raw.mp4 -i public/audio/ep3/sfx_p3.wav -filter_complex "\
[0:a]aresample=48000[c];[1:a]aresample=48000[s];[c][s]amix=inputs=2:normalize=0,loudnorm=I=-24:TP=-3:LRA=14[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/bolum3_final.mp4
