# Stage 1: Build Stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000
CMD ["npm", "run", "prod:start"]
