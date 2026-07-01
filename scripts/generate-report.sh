#!/bin/bash
echo "📊 Generating Allure report..."
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
echo "✅ Report ready"