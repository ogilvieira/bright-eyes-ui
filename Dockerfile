FROM node:18
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
RUN yarn add http-server-spa
COPY dist .
EXPOSE 3000
CMD ["npx", "http-server-spa", ".", "index.html", "3000"]