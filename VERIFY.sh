#!/bin/bash
# Verification script for deployed AI Code Builder
# Server: 144.202.29.208

SERVER="144.202.29.208"
URL="https://securemail.ltd"

echo "🔍 Verifying AI Code Builder deployment..."
echo ""

# Test 1: Auth API
echo "1️⃣ Testing Auth API..."
AUTH_RESPONSE=$(curl -s "$URL/api/auth/me")
if echo "$AUTH_RESPONSE" | grep -q "guest@local"; then
    echo "   ✅ Auth API returns guest user correctly"
else
    echo "   ❌ Auth API failed"
    echo "   Response: $AUTH_RESPONSE"
fi
echo ""

# Test 2: Home page
echo "2️⃣ Testing Home page..."
HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/")
if [ "$HOME_STATUS" = "200" ]; then
    echo "   ✅ Home page loads (200 OK)"
else
    echo "   ❌ Home page failed (HTTP $HOME_STATUS)"
fi
echo ""

# Test 3: Editor page
echo "3️⃣ Testing Editor page..."
EDITOR_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/editor")
if [ "$EDITOR_STATUS" = "200" ]; then
    echo "   ✅ Editor page loads (200 OK)"
else
    echo "   ❌ Editor page failed (HTTP $EDITOR_STATUS)"
fi
echo ""

# Test 4: Check server logs
echo "4️⃣ Checking server logs for errors..."
ssh "root@$SERVER" "tail -30 /var/log/ai-code-builder.log 2>/dev/null || pm2 logs ai-code-builder --lines 30 --nostream 2>/dev/null || echo 'No logs found'"
echo ""

echo "✅ Verification complete!"
echo ""
echo "🌐 Open the app: $URL/editor"
