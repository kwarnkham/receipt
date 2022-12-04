```
scp spa.zip root@receipt.madewithheart.tech:/root/
cd /var/www/receipt && rm -r ./* && mv /root/spa.zip ./spa.zip && unzip spa.zip && rm spa.zip && mv pwa/* ./ && rm -r pwa
systemctl restart nginx
```
