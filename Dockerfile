FROM node:14

#  current directoru
WORKDIR ./dockerContainer 

COPY package*.json ./

RUN npm install

COPY . .


# node app for 8 gb
# RUN npm run start 

# tekran kontrol edilecek calıstırma asamaları 
