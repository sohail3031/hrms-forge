# =================================================
# HRMS Forge - Playwright Test Runner
# Base image: Official Microsoft PLaywright image
# Browsers pre-installed: Chromium, Firefox, WebKit
# =================================================

# Official Playwright Docker Image
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Labels
LABEL maintainer="Sohail Ahmed Mohammed"
LABEL description="HRMSForge - Enterprise Playwright Test Runner"
LABEL version="1.0"

# Environment variables
ENV NODE_ENV=test
ENV HEADLESS=true
ENV CI=true
ENV WORKERS=2

# Working directory
WORKDIR /app

# Installing dependencies
COPY package*.json ./

# Use npm ci for reproducible installs
RUN npm ci --ignore-scripts

# Copy project files
COPY . .

# Create output directories
RUN mkdir -p allure-results allure-report playwright-report test-results logs fixtures/auth

# Default command
CMD [ "npx", "playwright", "test", "--project=chromium" ]
