# Fase de build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .


FROM node:18-alpine

WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/src/app . 

USER appuser

EXPOSE 3001
CMD ["node", "index.js"]
