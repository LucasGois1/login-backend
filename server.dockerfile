FROM node:latest

ENV MONGO_URL 'mongodb+srv://lucasgoisdev:LqlG1egm19Fc0xhW@joinus.l7okp.mongodb.net/JoinUS?retryWrites=true&w=majority'
ENV PORT 8000
ENV JWT_SECRET 'jks79812bjkb8¨55615vb¨%!'

WORKDIR /lucasgois/join-us-server

COPY package*.json ./

RUN yarn install --production

COPY ./dist ./dist

EXPOSE 8000

CMD npm start