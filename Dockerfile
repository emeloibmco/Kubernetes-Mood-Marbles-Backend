FROM node:10

WORKDIR /usr/src/app
# Install app dependencies

COPY backend/package.json ./

RUN npm install

# Copy app source code
COPY /backend/ . 

RUN npm run predev

#Expose port and start application
EXPOSE 3000

CMD [ "npm", "start" ]