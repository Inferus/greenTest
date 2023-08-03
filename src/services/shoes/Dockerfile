FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN npm install -g pino-pretty

CMD node shoes.js | pino-pretty