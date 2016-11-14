if [ -z "$1" ];
then
        serv='sd'
else
        serv=$1
fi
tar zxvf eliobox.tar.gz
if [ $serv = 'sd']
then
        sudo systemctl stop eliobox-server.service
else
        sudo service eliobox-server stop
fi
rm -rf /opt/eliobox/dist
mv eliobox/dist /opt/eliobox 
mv eliobox/server.py /opt/eliobox-server
if [ $serv = 'sd']
then
        sudo systemctl start eliobox-server.service
else
        sudo service eliobox-server start
fi
rm -r eliobox
rm eliobox.tar.gz
