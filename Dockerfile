FROM node:18
WORKDIR /app
COPY ./package.json .
RUN yarn install
COPY . .
CMD ["/bin/bash", "-c", "yarn build && yarn host:prod"]
EXPOSE 3000