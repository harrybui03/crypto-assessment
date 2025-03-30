# Simple Cryptocurrency Price Tracker

This is a simple cryptocurrency price tracker application that allows users to check the current price of cryptocurrencies and view their historical price charts.

## Tech Stack

### Frontend
- **ReactJs**: JavaScript library for building user interfaces
- **Recharts**: Charting library for React
- **MUI**: Material-UI component library for React

### Backend
- **NodeJs**: JavaScript runtime environment
- **ExpressJs**: Web framework for Node.js

### Cache
- **Redis**: In-memory data structure store used as a cache

### Data Source
- **CoinGecko API**: Public API for cryptocurrency data

## How to Access and Test the Deployed Application

1. Visit the deployed application link: https://crypto-chart-web.onrender.com/
2. Type the name or symbol of the cryptocurrency you want to see
3. View the current price and historical price chart

## How to Run the Application Locally

### Prerequisites
- Node.js installed
- Yarn package manager installed
- Git installed
- Docker installed

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/harrybui03/crypto-chart.git
```

#### Redis Setup with Docker
2. Set up Redis using Docker:
```bash
docker run -d -p 6379:6379 --name redis-cache redis:latest
```

#### Frontend Setup
3. Navigate to the frontend directory:
```bash
cd web
```

4. Install dependencies:
```bash
yarn
```

5. Start the development server:
```bash
yarn dev
```

#### Backend Setup
6. Navigate to the backend directory:
```bash
cd api
```

7. Install dependencies:
```bash
yarn
```

8. Create a `.env` file in the `/api` directory based on the `.env.example` template and fill in the required values. Include Redis configuration:
```
REDIS_URL=redis://:password@localhost:6379/0
```

9. Start the development server:
```bash
yarn dev
```

### Notes
- The Docker command runs Redis on the default port 6379
- Use `docker stop redis-cache` to stop the Redis container
- Use `docker start redis-cache` to restart the Redis container
- Ensure Redis is running before starting the backend server
```