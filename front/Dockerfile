FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

CMD [ "npm", "start" ]
