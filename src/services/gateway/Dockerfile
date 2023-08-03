FROM node:18

WORKDIR /gateway

COPY . .

RUN npm install

RUN npm install -g pino-pretty

# Bundle app source

EXPOSE 3000

CMD node gateway.js | pino-pretty