tar zxvf eliobox-sig.tar.gz
sudo systemctl stop eliobox-signaling.service
mv eliobox-sig/signaling.py /opt/eliobox-signaling
sudo systemctl start eliobox-signaling.service
rm -r eliobox-sig
rm eliobox-sig.tar.gz
