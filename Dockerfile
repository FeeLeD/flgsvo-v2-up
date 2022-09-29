ARG NODE_VERSION=lts-bullseye

FROM node:$NODE_VERSION
COPY /app .
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "start"]
