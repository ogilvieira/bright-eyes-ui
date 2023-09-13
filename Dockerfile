FROM node:18
WORKDIR /app
ARG API_URL=${API_URL}
COPY ./package.json .
RUN yarn install
COPY . .
RUN yarn build
