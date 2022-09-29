ARG NODE_VERSION=lts-bullseye

FROM --platform=linux/amd64 node:$NODE_VERSION
COPY . /app
WORKDIR /app
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "start"]
