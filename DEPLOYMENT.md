# Deployment Instructions

## Changes Made ✅

### 1. **Beautiful UI Overhaul** 🎨
- Glassmorphism effects with backdrop blur
- Purple/blue gradient theme (Bolt.new-style)
- Smooth animations and transitions
- Professional typography and spacing
- Modern card designs with hover effects
- Animated gradient backgrounds

### 2. **API Key Configuration** 🔐
- Settings modal with API key input
- Show/hide password toggle
- Model selection (Claude, GPT-4, etc.)
- Persistent storage in localStorage
- API key validation and error handling
- Secure client-side storage

### 3. **Welcome/Onboarding Screen** 👋
- Beautiful first-time user experience
- Two-step onboarding flow
- API key setup guidance
- Direct link to OpenRouter
- Skip option available

### 4. **Enhanced Components** ✨
- **Chat Interface**: Better error messages, API key checks, professional design
- **File Tree**: Colored icons, improved hover states, better UX
- **Preview Frame**: Loading states, beautiful empty state, smooth transitions
- **Settings Modal**: Glass effect, better validation, save confirmation
- **Homepage**: Animated gradients, feature showcase, modern CTA

### 5. **Better Error Handling** 🛡️
- Friendly API error messages
- Rate limit detection
- Invalid API key warnings
- Helpful error recovery suggestions

## To Deploy to Server (144.202.29.208)

### Option 1: SSH Deployment

```bash
# SSH into the server
ssh root@144.202.29.208

# Navigate to project directory
cd /root/ai-code-builder  # Or wherever the project is located

# Pull latest changes
git pull origin main

# Install dependencies (if needed)
npm install

# Build the application
npm run build

# Restart the application
# If using PM2:
pm2 restart ai-code-builder

# Or if using PM2 for the first time:
pm2 start npm --name "ai-code-builder" -- start

# Or if running directly:
npm start
```

### Option 2: Manual Deployment

1. Download the project from GitHub
2. Upload to server at `/root/ai-code-builder`
3. Run build and start commands

### Environment Variables (Optional)

Create `.env.local` (optional - for default API key):

```env
# Optional: Provide a default/demo API key
NEXT_PUBLIC_DEFAULT_OPENROUTER_KEY=your_openrouter_api_key_here
```

**Note**: Users can add their own API keys through the settings modal, so this is optional.

## Post-Deployment Checklist

After deploying, verify:

- [ ] Website loads at `https://securemail.ltd` or `http://144.202.29.208`
- [ ] Welcome screen appears for first-time visitors
- [ ] Settings modal opens and can save API key
- [ ] Chat interface shows proper error when no API key
- [ ] API key persists after page reload
- [ ] File tree displays correctly
- [ ] Code editor loads
- [ ] Preview frame shows content
- [ ] Export functionality works
- [ ] Mobile responsive design works

## Testing the Application

1. **First Visit**:
   - Should see welcome screen
   - Can add API key or skip
   
2. **Settings**:
   - Click settings icon in header
   - Add OpenRouter API key (get from https://openrouter.ai/keys)
   - Select preferred model
   - Save settings
   
3. **Building**:
   - Enter a prompt in chat: "Create a landing page"
   - AI should generate code
   - Files appear in file tree
   - Preview shows rendered result
   
4. **Export**:
   - Click Export button
   - Should download project.zip

## Troubleshooting

### Build Errors
- Make sure Node.js v18+ is installed
- Run `npm install` to ensure all dependencies are present
- Check `npm run build` output for errors

### API Errors
- Verify API key is correct (starts with `sk-or-`)
- Check OpenRouter account has credits
- Try a different model (GPT-3.5 is cheapest)

### Port Issues
- Default Next.js port is 3000
- Make sure port is not already in use
- Configure reverse proxy if needed (Nginx/Apache)

## Success Metrics ✅

- **UI**: Professional, modern design like Bolt.new ✅
- **UX**: Smooth animations and transitions ✅
- **API**: Persistent API key storage ✅
- **Onboarding**: Welcome screen for new users ✅
- **Error Handling**: Helpful, user-friendly messages ✅
- **Mobile**: Responsive design works ✅
- **Performance**: Fast build and runtime ✅

## Technical Stack

- **Framework**: Next.js 16 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand with localStorage persistence
- **Editor**: Monaco Editor (VS Code)
- **AI**: OpenRouter API (Claude, GPT-4, etc.)

## Files Changed

- `app/globals.css` - New animations and effects
- `lib/store.ts` - Added localStorage persistence
- `components/chat/chat-interface.tsx` - Better error handling
- `components/settings/settings-modal.tsx` - Improved design
- `components/welcome/welcome-screen.tsx` - NEW: Welcome flow
- `components/file-tree/file-tree.tsx` - Better styling
- `components/preview/preview-frame.tsx` - Loading states
- `app/editor/page.tsx` - Welcome screen integration
- `app/page.tsx` - Modern homepage design

## Support

For issues or questions:
- GitHub: https://github.com/roichk069/ai-code-builder
- Check browser console for errors
- Verify API key configuration
- Check server logs with `pm2 logs ai-code-builder`
