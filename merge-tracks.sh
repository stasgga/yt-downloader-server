#!/bin/bash -e

# merge video with audio. src: https://superuser.com/a/277667
# run on browsers: https://stackoverflow.com/a/24468585
find datadir/ -name *_video | sed 's/_video$//g' | xargs -I 'file:{}' ffmpeg -i 'file:{}_video' -i 'file:{}_audio' \
-c:v copy -c:a aac -strict experimental \
-map 0:v:0 -map 1:a:0 -pix_fmt yuv420p 'file:{}'

#find datadir/ -name *_video | xargs -L 1 -I {} rm '{}'
#find datadir/ -name *_audio | xargs -L 1 -I {} rm '{}'

#ffmpeg -i video.mp4 -i audio.wav \
#-c:v copy -c:a aac -strict experimental \
#-map 0:v:0 -map 1:a:0 output.mp4

