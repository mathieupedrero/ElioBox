#!/bin/bash
mkdir eliobox
cd client
grunt build

cd dist

files=`find -type f | sed 's/^\.\//"/' | tr '\n' '%' | sed 's/\%/",/g' | sed "s/.$//"`
echo "fichiers $files !"
echo "cache_files = [" > service-worker.js
echo $files >> service-worker.js
echo "];" >> service-worker.js
cat ../service-worker.js >> service-worker.js

cd ..
cp -r dist ../eliobox
cd ..
cd server
cp server.py ../eliobox
cp signaling.py ../eliobox
cd ..
cd eliobox
pattern='s/'
pattern+='###BUILD_TAG###'
pattern+='/'
pattern+="$(date +"%s")"
pattern+='/g'
echo $pattern
sed -i $pattern server.py
sed -i $pattern dist/index.html
sed -i $pattern dist/service-worker.js
cd .. 
tar zcvf eliobox.tar.gz eliobox
scp eliobox.tar.gz $1:~
ssh $1 'bash -s' < buildonpi.sh
rm -r eliobox
rm eliobox.tar.gz
