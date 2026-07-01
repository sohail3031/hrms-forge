#!/bin/bash
echo "🚀 Running regression suite..."
npx playwright test --grep @regression --project=chromium
echo "✅ Regression complete"