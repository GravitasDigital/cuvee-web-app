#!/bin/bash

# Test script for Voyage Passport API
# This tests the PHP API endpoint directly

echo "🧪 Testing Voyage Passport API..."
echo ""

# Prompt for email address
read -p "Enter email address to test: " TEST_EMAIL

if [ -z "$TEST_EMAIL" ]; then
    echo "❌ Email address is required"
    exit 1
fi

echo ""
echo "📡 Fetching data for: $TEST_EMAIL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test the PHP API directly
php -r "
\$email = '$TEST_EMAIL';
include 'api-voyage-passport.php';
" | python3 -m json.tool

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Test complete"
