if [ -z $1 ];
then
        serv='sd'
else
        serv=$1
fi  
tar zxvf eliobox-sig.tar.gz
if [ $serv = "sd"]
then
        systemctl stop eliobox-signaling.service
else
        service eliobox-signaling stop
fi
mv eliobox-sig/signaling.py /opt/eliobox-signaling
if [ $serv = "sd"]
then
        systemctl start eliobox-signaling.service
else
        service eliobox-signaling start
fi
rm -r eliobox-sig
rm eliobox-sig.tar.gz
