FROM node:16-alpine

WORKDIR /src/app

ADD init.js /src/app/init.js
ADD package.json /src/app/package.json
ADD package-lock.json /src/app/package-lock.json
RUN npm install

CMD node init.js
