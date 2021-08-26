FROM node:14-buster

WORKDIR /app/src

RUN yarn install --frozen-lockfile --production=true --silent

CMD [ "tail", "-f", "/dev/null" ]
