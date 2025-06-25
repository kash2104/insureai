FROM node:23.4-alpine3.21

WORKDIR /app

COPY package.json ./ 
COPY package-lock.json ./ 
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]