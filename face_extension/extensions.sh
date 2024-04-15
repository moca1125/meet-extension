#!/usr/bin/env bash

#NOTE: if you are on macOS, update to bash v4 i.e brew install bash

rm -rf extension extension.zip
cp -r public extension 
cd extension

declare -A scripts0=(
    [file]='tf-core.js'
    [url]='https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js'
)
declare -A scripts1=(
    [file]='tf-converter.js'
    [url]='https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js'
)
declare -A scripts2=(
    [file]='tf-backend-webgl.js'
    [url]='https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js'
)
declare -A scripts3=(
    [file]='face-landmarks-detection.js'
    [url]='https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js'
)
declare -A scripts4=(
    [file]='face-landmarks-detection.js'
    [url]='https://unpkg.com/@@tensorflow/tfjs-backend-cpu.js'
)



declare -n scripts
for scripts  in ${!scripts@}; do
  curl ${scripts[url]} -o ${scripts[file]}
  sed -i"" -e "s|${scripts[url]}|${scripts[file]}|g" main.js
done

zip -r extension.zip *
mv extension.zip ../