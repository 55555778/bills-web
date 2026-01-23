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

# 1. 拷贝代码 (这行保持原样)
COPY --from=builder /app/dist /usr/share/nginx/html  

# 2. 【新增】拷贝我们刚写的配置文件，覆盖 Nginx 的默认配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY ./dist /usr/share/nginx/html

EXPOSE 80

