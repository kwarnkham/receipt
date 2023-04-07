```
scp spa.zip root@coffee.book-mm.com:/root/
cd /etc/nginx/html/receipt && rm -rf ./* && mv /root/spa.zip ./spa.zip && unzip spa.zip && rm -rf spa.zip && mv pwa/* ./ && rm -rf pwa
systemctl restart nginx
```
