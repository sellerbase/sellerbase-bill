FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npm install @heroicons/react@2.0.18 --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
