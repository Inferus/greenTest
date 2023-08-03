FROM node:18

WORKDIR /app

COPY . .

RUN npm install


EXPOSE 5672

CMD [ "node", "shoes.js" ]