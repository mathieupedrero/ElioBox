#!/bin/bash
if [ -z "$2" ];
then
	port='22'
else
	port=$2
fi
mkdir eliobox-sig
cd server
cp signaling.py ../eliobox-sig
cd ..
tar zcvf eliobox-sig.tar.gz eliobox-sig
scp -P $port eliobox-sig.tar.gz $1:~
ssh -p $port $1 'bash -s' < buildonpi-sig.sh
rm -r eliobox-sig
rm eliobox-sig.tar.gz

