tar zxvf eliobox.tar.gz
sudo systemctl stop kiosk-application.service
sudo systemctl stop eliobox-server.service
rm -rf /opt/eliobox/dist
mv eliobox/dist /opt/eliobox 
mv eliobox/server.py /opt/eliobox-server
sudo systemctl start eliobox-server.service
sudo systemctl start kiosk-application.service
rm -r eliobox
rm eliobox.tar.gz
