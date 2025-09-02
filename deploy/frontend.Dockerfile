FROM nginx:alpine

# Nginx config with API reverse proxy
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY index.html /usr/share/nginx/html/
COPY Fish-Smile01.html /usr/share/nginx/html/
COPY Fish-Smile02.html /usr/share/nginx/html/
COPY Fish-Smile03.html /usr/share/nginx/html/
COPY Fish-Smile04.html /usr/share/nginx/html/
COPY test-fix.html /usr/share/nginx/html/
COPY js /usr/share/nginx/html/js

EXPOSE 80
