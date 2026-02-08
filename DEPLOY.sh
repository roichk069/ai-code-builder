#!/bin/bash
# Deployment script for AI Code Builder
# Server: 144.202.29.208

SERVER="root@144.202.29.208"
APP_DIR="/root/ai-code-builder"
LOCAL_DIR="/data/.openclaw/workspace/ai-code-builder"

echo "🚀 Deploying AI Code Builder..."
echo ""

# Step 1: Copy environment file
echo "📄 Copying .env.local..."
scp "$LOCAL_DIR/.env.local" "$SERVER:$APP_DIR/"

# Step 2: Copy updated source files
echo "📦 Copying updated source files..."
scp "$LOCAL_DIR/lib/auth.ts" "$SERVER:$APP_DIR/lib/"
scp "$LOCAL_DIR/lib/db.ts" "$SERVER:$APP_DIR/lib/"
scp "$LOCAL_DIR/app/api/auth/me/route.ts" "$SERVER:$APP_DIR/app/api/auth/me/"
scp "$LOCAL_DIR/components/preview/preview-frame.tsx" "$SERVER:$APP_DIR/components/preview/"

# Step 3: Copy build artifacts
echo "🔨 Copying build files..."
scp -r "$LOCAL_DIR/.next" "$SERVER:$APP_DIR/"

# Step 4: Copy documentation
echo "📚 Copying documentation..."
scp "$LOCAL_DIR/AUTH-OPTIONAL-CHANGES.md" "$SERVER:$APP_DIR/"

# Step 5: Restart the app on server
echo "🔄 Restarting application..."
ssh "$SERVER" << 'ENDSSH'
cd /root/ai-code-builder
# Try pm2 first, fall back to direct restart
if command -v pm2 &> /dev/null; then
    echo "Using pm2..."
    pm2 restart ai-code-builder || pm2 start npm --name "ai-code-builder" -- start
else
    echo "Using direct node process..."
    pkill -f "next start" || true
    sleep 2
    nohup npm run start > /var/log/ai-code-builder.log 2>&1 &
fi
ENDSSH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔍 Check status:"
echo "   ssh $SERVER 'pm2 status' or"
echo "   ssh $SERVER 'tail -f /var/log/ai-code-builder.log'"
echo ""
echo "🌐 Test the app:"
echo "   https://securemail.ltd/editor"
