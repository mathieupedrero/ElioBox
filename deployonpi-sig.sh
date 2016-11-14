if [ -z $1 ];
then
        serv='sd'
else
        serv=$1
fi  
tar zxvf eliobox-sig.tar.gz
if [ $serv = 'sd']
then
        sudo systemctl stop eliobox-signaling.service
else
        sudo service eliobox-signaling stop
fi
mv eliobox-sig/signaling.py /opt/eliobox-signaling
if [ $serv = 'sd']
then
        sudo systemctl start eliobox-signaling.service
else
        sudo service eliobox-signaling start
fi
rm -r eliobox-sig
rm eliobox-sig.tar.gz
