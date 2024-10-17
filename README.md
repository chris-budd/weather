# Weather Forecast: 5-Day Weather Forecast App

## Overview

Weather Forecast provides a 5-day / 3 hourly weather forecast for any US ZIP code. Built with Next.js and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/chris-budd/weather.git
   ```

2. Navigate to the project directory:
   ```
   cd weather
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory and add your OpenWeather API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

### Running the App

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

This project uses Jest and React Testing Library for unit and component testing. To run the tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

The test files are located in the `src/__tests__` directory. They cover utility functions, components, and integration tests.
