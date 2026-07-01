#!/bin/bash
echo "🚀 Running smoke tests..."
npx playwright test --grep @smoke --project=chromium
echo "✅ Smoke tests eomplete"