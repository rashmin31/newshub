# NewsHub - News Aggregator

A modern news aggregator built with React that pulls articles from multiple trusted sources and displays them in a clean, easy-to-read format. Features include article search, filtering, personalized feeds, and mobile responsiveness.

## Features

-   **Multi-source News Integration**: Aggregates news from The Guardian, The New York Times, and NewsAPI
-   **Advanced Search & Filtering**: Search articles by keyword and filter by date, category, and source
-   **Personalized Feed**: Customize your news feed with preferred sources and categories
-   **Responsive Design**: Optimized for all device sizes
-   **Dark/Light Theme**: Support for both light and dark modes
-   **Performance Optimized**: Includes caching and rate limiting mechanisms

## Prerequisites

Before you begin, ensure you have:

-   Node.js (v16 or higher)
-   Yarn package manager
-   Docker and Docker Compose (for containerized deployment)
-   API keys from:
    -   The Guardian API
    -   The New York Times API
    -   NewsAPI

## Getting Started

You can run NewsHub either locally or using Docker. Choose the method that best suits your needs.

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/newshub.git
cd newshub
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory:

```env
VITE_GUARDIAN_API_KEY=your_guardian_api_key
VITE_NYTIMES_API_KEY=your_nytimes_api_key
VITE_NEWSAPI_API_KEY=your_newsapi_api_key
```

4. Start the development server:

```bash
yarn dev
```

### Docker Development

1. Build and start the container:

```bash
docker compose up newshub-dev
```

The application will be available at http://localhost:5173

### Docker Configuration

The project includes two services in docker-compose.yml:

1. **Development Service (newshub-dev)**

    - Hot-reloading enabled
    - Source code mounted as volume
    - Port 5173 exposed
    - Development environment variables

2. **Test Service (newshub-test)**
    - Dedicated service for running tests
    - Same source code mounting
    - Test-specific environment variables

### Common Docker Commands

```bash
# Start development environment
docker compose up newshub-dev

# Start in detached mode
docker compose up -d newshub-dev

# Run tests
docker compose run --rm newshub-test

# Run tests in watch mode
docker compose run --rm newshub-test yarn test:watch

# Stop services
docker compose down

# Rebuild without cache
docker compose build --no-cache newshub-dev
```

### Troubleshooting Docker

1. **Port Conflict**

```bash
# If port 5173 is already in use, modify in docker-compose.yml:
ports:
  - "3000:5173"  # Change left number to any available port
```

2. **Node Modules Issues**

```bash
# Rebuild node_modules in container
docker compose run --rm newshub-dev yarn install
```

## Available Scripts

-   `yarn dev` - Start development server
-   `yarn build` - Build for production
-   `yarn preview` - Preview production build
-   `yarn test` - Run tests
-   `yarn test:watch` - Run tests in watch mode
-   `yarn test:coverage` - Generate test coverage report
-   `yarn lint` - Run ESLint

## Project Structure

```
newshub/
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and service integrations
│   ├── store/            # Redux store configuration
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── __tests__/           # Test files
├── public/              # Static assets
└── docker/              # Docker configuration files
```

## Environment Variables

| Variable              | Description          | Required |
| --------------------- | -------------------- | -------- |
| VITE_GUARDIAN_API_KEY | The Guardian API Key | Yes      |
| VITE_NYTIMES_API_KEY  | NY Times API Key     | Yes      |
| VITE_NEWSAPI_API_KEY  | NewsAPI Key          | Yes      |

## Testing

The project includes a comprehensive test suite:

-   Unit tests for components
-   Integration tests for API services
-   State management tests
-   Custom hooks tests

Run tests using:

```bash
# Local
yarn test

# Docker
docker compose run --rm newshub-test
```

## Built With

-   React + TypeScript
-   Vite
-   Redux Toolkit
-   TailwindCSS
-   Jest + Testing Library
-   Docker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
