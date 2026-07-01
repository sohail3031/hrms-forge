# Official Playwright Docker image - browser pre-installed
FROM mcr.microsoft.com/playwright:v1.40.0-jamy

# Set working directory
WORKDIR /app

# Copy dependency files first (layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of project
COPY . .

#Default command - runs full regression
CMD [ "npx", "playwright", "test", "--project=chromium" ]