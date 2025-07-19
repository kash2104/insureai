#building the dist folder
FROM node:23.4-alpine3.21 AS build

WORKDIR /app

COPY package.json package-lock.json ./ 
RUN npm install

COPY tsconfig.json ./
COPY src ./src 

RUN npx tsc -b

# copying only the dist folder
FROM node:23.4-alpine3.21
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY --from=build /app/dist ./dist

EXPOSE 4000
ENTRYPOINT [ "node" ]
CMD ["dist/index.js"]
