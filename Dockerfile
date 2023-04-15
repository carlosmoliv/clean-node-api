FROM node:18
WORKDIR /usr/src/clean-node-api
COPY package.json yarn.lock ./
RUN yarn --production