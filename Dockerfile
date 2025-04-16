FROM node:12.14-slim as builder
WORKDIR /mnt
ADD . /mnt
RUN npm install
RUN npm run build

FROM nginx:alpine
LABEL org.opencontainers.image.source="https://github.com/redmadrobot-tomsk/mik-front-admin"

RUN rm /etc/nginx/conf.d/default.conf
COPY ./config/nginx/default.conf /etc/nginx/conf.d/
WORKDIR /usr/share/nginx/html
COPY --from=builder /mnt/public/ .
RUN rm ./index-template.html
