tar zxvf eliobox.tar.gz
sudo systemctl stop eliobox-server.service
rm -rf /opt/eliobox/dist
mv eliobox/dist /opt/eliobox 
mv eliobox/server.py /opt/eliobox-server
sudo systemctl start eliobox-server.service
rm -r eliobox
rm eliobox.tar.gz
