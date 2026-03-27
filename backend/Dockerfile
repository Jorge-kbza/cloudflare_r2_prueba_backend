FROM node:20

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install
RUN npm install dotenv
RUN npm install @aws-sdk/s3-request-presigner

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]