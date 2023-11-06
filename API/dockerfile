FROM node:20-alpine3.17
WORKDIR /app

# COPY package.json and package-lock.json files
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY
COPY . .

RUN npm install
RUN npx prisma generate
RUN npm install pm2 -g
RUN npx tsc
EXPOSE 3003
CMD [ "pm2-runtime", "ecosystem.config.js"]