FROM node:16

WORKDIR /gateway

COPY . .

RUN npm install


# Bundle app source

EXPOSE 4000


CMD ["node", "gateway.js"]