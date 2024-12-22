FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && \
    npm install @supabase/ssr @supabase/supabase-js && \
    npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
