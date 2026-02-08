# Manual Deployment Guide

Since automated SSH deployment requires credentials, follow these steps to deploy manually:

## Option 1: Deploy via File Transfer (Recommended)

### Step 1: Package the changes
```bash
cd /data/.openclaw/workspace/ai-code-builder
tar -czf ai-code-builder-update.tar.gz \
  .env.local \
  .next \
  lib/auth.ts \
  lib/db.ts \
  app/api/auth/me/route.ts \
  components/preview/preview-frame.tsx \
  AUTH-OPTIONAL-CHANGES.md
```

### Step 2: Transfer to server
Use your preferred method (FTP, SFTP, SCP, etc.):
```bash
# Using SCP (if you have SSH access):
scp ai-code-builder-update.tar.gz root@144.202.29.208:/root/

# Or upload via web panel/FTP
```

### Step 3: Extract on server
SSH into the server and run:
```bash
ssh root@144.202.29.208

cd /root/ai-code-builder
tar -xzf ../ai-code-builder-update.tar.gz

# Restart the app
pm2 restart ai-code-builder
# OR
pkill -f "next start"
npm run start
```

## Option 2: Rebuild on Server

If you can SSH into the server:

```bash
ssh root@144.202.29.208
cd /root/ai-code-builder

# Copy the updated files manually or use git pull
# Then:

# Update auth.ts
nano lib/auth.ts
# [Make the changes from AUTH-OPTIONAL-CHANGES.md]

# Update db.ts
nano lib/db.ts
# [Make the changes from AUTH-OPTIONAL-CHANGES.md]

# Update auth/me route
nano app/api/auth/me/route.ts
# [Make the changes from AUTH-OPTIONAL-CHANGES.md]

# Update preview-frame.tsx
nano components/preview/preview-frame.tsx
# [Make the changes from AUTH-OPTIONAL-CHANGES.md]

# Create .env.local
cat > .env.local << 'EOF'
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=temp
DATABASE_NAME=ai_code_builder
JWT_SECRET=temporary_secret_key_change_in_production_1234567890
NEXT_PUBLIC_APP_URL=https://securemail.ltd
NODE_ENV=production
EOF

# Rebuild
npm run build

# Restart
pm2 restart ai-code-builder
```

## Option 3: Copy Individual Files

Copy these exact files from the workspace to the server:

1. `/data/.openclaw/workspace/ai-code-builder/.env.local` → `/root/ai-code-builder/.env.local`
2. `/data/.openclaw/workspace/ai-code-builder/lib/auth.ts` → `/root/ai-code-builder/lib/auth.ts`
3. `/data/.openclaw/workspace/ai-code-builder/lib/db.ts` → `/root/ai-code-builder/lib/db.ts`
4. `/data/.openclaw/workspace/ai-code-builder/app/api/auth/me/route.ts` → `/root/ai-code-builder/app/api/auth/me/route.ts`
5. `/data/.openclaw/workspace/ai-code-builder/components/preview/preview-frame.tsx` → `/root/ai-code-builder/components/preview/preview-frame.tsx`
6. Copy entire `.next` folder (or rebuild on server)

## Verification

After deployment, verify everything works:

```bash
# Test auth API
curl https://securemail.ltd/api/auth/me

# Should return:
# {"user":{"userId":0,"email":"guest@local","name":"Guest User"},"isGuest":true}

# Test editor page
curl -I https://securemail.ltd/editor

# Should return HTTP 200
```

## Troubleshooting

### If app won't start:
```bash
# Check logs
pm2 logs ai-code-builder
# or
tail -f /var/log/ai-code-builder.log

# Check if port is in use
netstat -tulpn | grep 3000

# Rebuild if needed
cd /root/ai-code-builder
npm run build
pm2 restart ai-code-builder
```

### If auth still fails:
1. Make sure `.env.local` exists in `/root/ai-code-builder/`
2. Check that `JWT_SECRET` is set in `.env.local`
3. Verify file permissions: `chmod 600 .env.local`
4. Restart app completely: `pm2 restart ai-code-builder`

### If preview doesn't work:
1. Check browser console for errors
2. Verify the sandbox attribute change was applied
3. Clear browser cache
4. Try hard refresh (Ctrl+Shift+R)

## Files Changed

See `AUTH-OPTIONAL-CHANGES.md` for detailed list of all changes made.
