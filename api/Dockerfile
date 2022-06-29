FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g nodemon

# COPY . /usr/src/app
COPY package*.json /usr/src/app/


RUN npm install

EXPOSE 8080

CMD [ "nodemon", "app.js" ]
