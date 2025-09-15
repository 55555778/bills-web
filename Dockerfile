# 第一阶段：构建
FROM node:20 AS builder 
WORKDIR /app  
COPY package*.json ./
# RUN chown -R node:node /app

RUN npm install    
COPY . .

RUN npm run build 


# 第二阶段：nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html  

# COPY ./dist /usr/share/nginx/html

EXPOSE 9090

