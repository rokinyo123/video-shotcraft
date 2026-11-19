#!/bin/bash
# EP3 · Bölüm 2 son miks: klip təbii səsləri (gülüş, yağış, qışqırıq) + musiqi; hamısı VO altında sidechain ilə enir; -14 LUFS, -1 dB pik
# v1 — yalnız musiqi tonları (çıxarılıb); v2 — 0–2.8 s gülüş (sonrası musiqi, kəsilir); v7 — yağış/su/qışqırıqlar (tam)
set -e; cd "$(dirname "$0")/.."
ffmpeg -v error -y -i out/ep3b_raw.mp4 -i public/audio/ep3/bed_b2.wav -i public/vo/ep3/bolum2.mp3 -i public/media/ep3b/v2.mp4 -i public/media/ep3b/v7.mp4 -filter_complex "\
[3:a]atrim=0:2.9,asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.15,afade=t=out:st=2.3:d=0.6,volume=0.55,adelay=11700|11700[laugh];\
[4:a]aresample=48000,afade=t=in:d=0.4,afade=t=out:st=7.0:d=1.0,volume=0.45,adelay=80000|80000[flood];\
[1:a]aresample=48000[bed];\
[bed][laugh][flood]amix=inputs=3:normalize=0[mus];\
[2:a]aresample=48000,pan=stereo|c0=c0|c1=c0,asplit=2[vo][key];\
[mus][key]sidechaincompress=threshold=0.04:ratio=5:attack=25:release=350[duck];\
[duck][vo]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=11[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/bolum2_final.mp4
