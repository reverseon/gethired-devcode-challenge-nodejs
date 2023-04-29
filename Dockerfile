FROM node:latest

# Create ./app directory
WORKDIR /app

# Copy package.json to ./app
COPY package*.json /app

# copy src to ./app
COPY ./src /app/src

# tsconfig.json

COPY ./tsconfig.json /app

# Install dependencies

RUN npm install

# Expose port 3030

EXPOSE 3030

# Run the app

CMD ["npm", "run", "prod"]