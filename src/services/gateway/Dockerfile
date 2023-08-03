FROM node:18

WORKDIR /gateway

COPY . .

RUN npm install

# Bundle app source

EXPOSE 3000

CMD [ "node", "gateway.js" ]