ARG NODE_VERSION=lts-bullseye

FROM --platform=linux/amd64 arm64v8/node:$NODE_VERSION
COPY /app /app
WORKDIR /app
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "start"]
