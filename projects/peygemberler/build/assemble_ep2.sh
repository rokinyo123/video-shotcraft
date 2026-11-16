#!/bin/bash
# EP2 tam video: treyler + əsas (A0 içində 240-449 kadrları düzəlişlə əvəzlənir) + A1 + A2 + B0 + B1
set -e
cd "$(dirname "$0")/.."
ffmpeg -v error -y \
 -i out/ep2_trailer.mp4 -i out/ep2_A0.mp4 -i out/ep2_Apatch.mp4 -i out/ep2_A1.mp4 -i out/ep2_A2.mp4 -i out/ep2_B0.mp4 -i out/ep2_B1.mp4 \
 -i out/ep2_trailer_audio.wav -i out/ep2_main_audio.wav \
 -filter_complex "\
[1:v]trim=end_frame=240,setpts=PTS-STARTPTS[a0a];\
[1:v]trim=start_frame=450,setpts=PTS-STARTPTS[a0b];\
[0:v][a0a][2:v][a0b][3:v][4:v][5:v][6:v]concat=n=8:v=1:a=0,format=yuv420p[v];\
[7:a][8:a]concat=n=2:v=0:a=1[a]" \
 -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 20 -maxrate 3800k -bufsize 7600k \
 -c:a aac -b:a 192k -movflags +faststart out/Idris_tam.mp4
