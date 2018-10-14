FROM resin/raspberry-pi-alpine-node:9.11.1

RUN npm install yarn -g
RUN npm install concurrently -g

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN script/docker/setup

EXPOSE 5000
CMD [ "script/stack" ]
