ARG NODE_VERSION=lts-bullseye

# for Mac on M1
# FROM --platform=linux/amd64 arm64v8/node:$NODE_VERSION

FROM node:$NODE_VERSION

ARG DATABASE_URL=postgresql://user:password@localhost:5432

COPY /app /app
WORKDIR /app
RUN export DATABASE_URL=$DATABASE_URL
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "start"]
