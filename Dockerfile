FROM node:18
WORKDIR /app
COPY ./package.json .
RUN yarn install
COPY . .
ENV API_URL=$API_URL
RUN yarn build
CMD [ "yarn", "host:prod" ]
