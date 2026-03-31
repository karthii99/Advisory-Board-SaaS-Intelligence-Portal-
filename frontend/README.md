# SaaS Intelligence Frontend

React frontend for the SaaS Intelligence Decision-Support System.

## Features

- 📊 Real-time company intelligence dashboard
- 🧠 AI-powered analysis enhancement
- 📈 Visual score representations
- 🔄 Live server status monitoring
- 📱 Responsive design

## Quick Start

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the backend server**
   ```bash
   cd ../src
   node server.js
   ```

3. **Start the frontend**
   ```bash
   cd ../frontend
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001`

## Environment Variables

Create a `.env.local` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:3000/api
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## Components

### Main Dashboard
- Company list with overview
- Detailed intelligence view
- Score visualizations
- AI enhancement capability

### Features
- **Server Status**: Real-time backend connection monitoring
- **Data Seeding**: Quick database population with sample companies
- **AI Enhancement**: OpenAI-powered intelligence analysis
- **Responsive Design**: Works on desktop and mobile

## API Integration

The frontend connects to the backend API at:
- `GET /api/clients/health` - Server health check
- `GET /api/clients` - List all companies
- `GET /api/clients/:id` - Get company details with intelligence
- `POST /api/clients/seed` - Seed sample data
- `POST /api/clients/ai-intelligence/:id` - AI enhancement

## Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

## Note on Tailwind CSS

The Tailwind CSS warnings in the IDE are normal and will resolve once the dependencies are installed and the development server is running.
