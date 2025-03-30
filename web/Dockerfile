# ./web/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

EXPOSE 5173

# Start React dev server
CMD ["yarn", "dev"]

# For production build:
# RUN yarn build
# CMD ["yarn", "serve"]  # If using serve package