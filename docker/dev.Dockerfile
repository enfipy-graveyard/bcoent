FROM node:10-alpine
WORKDIR /app
ADD package.json yarn.lock ./
RUN apk add --no-cache --virtual .gyp python make g++
RUN yarn install
EXPOSE 3000
CMD ["yarn", "dev"]
