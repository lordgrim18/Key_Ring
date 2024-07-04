FROM node:20-alpine3.19

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV=

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . .

ENV PORT 5001

EXPOSE $PORT

CMD ["node", "./src/server.js"]