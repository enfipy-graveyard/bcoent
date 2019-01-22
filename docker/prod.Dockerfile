FROM node:10-alpine

RUN mkdir /app
WORKDIR /app

RUN adduser -D -g '' appuser

ADD package.json yarn.lock ./
ADD protos ./protos
ADD src ./src

RUN yarn install --production && yarn cache clean

CMD ["yarn", "start"]
