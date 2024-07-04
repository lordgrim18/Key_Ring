FROM node:20-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 5001

EXPOSE $PORT

CMD ["npm", "run", "dev"]