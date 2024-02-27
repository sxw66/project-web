FROM harbor.3irobotix.net/base/base_nginx:v1
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]
