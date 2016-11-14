#!/bin/bash
if [ -z "$2" ];
then
	port='22'
else
	port=$2
fi
if [ -z "$3" ];
then
        serv='sd'
else
        serv=$3
fi

mkdir eliobox-sig
cd server
cp signaling.py ../eliobox-sig
cd ..
tar zcvf eliobox-sig.tar.gz eliobox-sig
scp -P $port eliobox-sig.tar.gz $1:~
scp -P $port deployonpi-sig.sh $1:~
ssh -p $port $1 "deployonpi-sig.sh $serv"
rm -r eliobox-sig
rm eliobox-sig.tar.gz

