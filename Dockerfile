FROM node:alpine

WORKDIR /user/app

COPY package*.json ./
RUN npm install pm2 -g
RUN npm install

COPY . .

EXPOSE 3000

WORKDIR /user/app

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
