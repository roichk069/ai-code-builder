# Known Issues & Future Improvements

This document tracks known issues, limitations, and planned improvements for the AI Code Builder.

## ✅ Fixed Issues (Current Deployment)

- [x] **Auth errors** - Made authentication optional, app works in guest mode
- [x] **MySQL not configured** - App no longer requires database to function
- [x] **Iframe sandbox warnings** - Removed `allow-same-origin` for security
- [x] **Cookie errors** - Added graceful error handling for auth cookies
- [x] **Build errors** - All TypeScript compilation issues resolved
- [x] **Preview not loading** - Fixed and verified working

## 🐛 Known Issues

### Minor Issues

1. **Console Toggle Missing**
   - **Issue**: Console panel exists but no button to toggle it
   - **Impact**: Low - Console is hidden by default
   - **Workaround**: None currently
   - **Priority**: Low
   - **Fix**: Add console toggle button to editor toolbar

2. **Mobile Sidebar**
   - **Issue**: On mobile/tablet, sidebar toggle works but could be more polished
   - **Impact**: Low - Still functional
   - **Workaround**: Use landscape orientation
   - **Priority**: Low
   - **Fix**: Improve mobile responsive breakpoints

3. **File Tree Context Menu**
   - **Issue**: Right-click context menu not implemented
   - **Impact**: Low - Can still manage files
   - **Workaround**: Use UI buttons
   - **Priority**: Low
   - **Fix**: Add context menu with rename/delete options

### Database-Dependent Features (Expected)

These features require MySQL database setup and are intentionally disabled in guest mode:

4. **Save Projects to Database**
   - **Status**: Expected limitation
   - **Impact**: Medium - Projects only saved to localStorage
   - **Workaround**: Export projects as ZIP regularly
   - **Note**: Will work once MySQL is configured

5. **User Authentication**
   - **Status**: Expected limitation
   - **Impact**: Low - Guest mode works fine
   - **Workaround**: None needed
   - **Note**: Optional feature for multi-user setup

6. **Project Sharing**
   - **Status**: Expected limitation
   - **Impact**: Low - Can share exported ZIPs instead
   - **Workaround**: Export and share ZIP files
   - **Note**: Will work once MySQL is configured

## 🚀 Future Improvements

### High Priority

1. **Auto-Save Indicator**
   - Show visual feedback when project is auto-saved to localStorage
   - Add "last saved" timestamp
   - Estimated effort: 1-2 hours

2. **Better Error Messages**
   - More descriptive error messages for API failures
   - User-friendly troubleshooting tips
   - Estimated effort: 2-3 hours

3. **Undo/Redo**
   - Add undo/redo functionality to code editor
   - Track change history
   - Estimated effort: 3-4 hours

### Medium Priority

4. **Dark/Light Theme Toggle**
   - Currently fixed to dark theme
   - Add theme switcher
   - Persist preference
   - Estimated effort: 2-3 hours

5. **More Templates**
   - Add 10+ professional templates
   - Categories: portfolio, landing, dashboard, blog, etc.
   - Template preview thumbnails
   - Estimated effort: 4-6 hours

6. **Code Formatting**
   - Add Prettier integration
   - Auto-format on save
   - Format button in toolbar
   - Estimated effort: 2-3 hours

7. **Search & Replace**
   - Global search across all files
   - Find and replace functionality
   - Regex support
   - Estimated effort: 3-4 hours

8. **Console Panel Toggle**
   - Add button to show/hide console
   - Keyboard shortcut support
   - Resize panel
   - Estimated effort: 1-2 hours

### Low Priority

9. **Git Integration**
   - Connect to GitHub repos
   - Commit and push changes
   - Branch management
   - Estimated effort: 8-12 hours

10. **Collaborative Editing**
    - Real-time multi-user editing
    - WebSocket synchronization
    - Cursor positions
    - Estimated effort: 15-20 hours

11. **AI Model Comparison**
    - Generate with multiple models
    - Side-by-side comparison
    - Vote on best output
    - Estimated effort: 6-8 hours

12. **Deployment Integration**
    - One-click deploy to Netlify
    - Deploy to Vercel
    - Deploy to GitHub Pages
    - Estimated effort: 8-12 hours

13. **Asset Management**
    - Upload images
    - Image optimization
    - Asset library
    - Estimated effort: 6-8 hours

14. **Code Snippets Library**
    - Save reusable snippets
    - Community snippets
    - Categories and search
    - Estimated effort: 6-8 hours

15. **Keyboard Shortcuts Panel**
    - Show all shortcuts
    - Customizable bindings
    - Cheat sheet overlay
    - Estimated effort: 3-4 hours

## 🔧 Technical Debt

1. **TypeScript Strictness**
   - Some `any` types could be more specific
   - Add stricter type checking
   - Estimated effort: 4-6 hours

2. **Test Coverage**
   - Add unit tests for core functionality
   - Integration tests for API routes
   - E2E tests for critical flows
   - Estimated effort: 12-16 hours

3. **Error Boundaries**
   - Add React error boundaries
   - Graceful error recovery
   - Better error reporting
   - Estimated effort: 3-4 hours

4. **Performance Optimization**
   - Lazy loading for Monaco editor
   - Code splitting
   - Memoization
   - Estimated effort: 4-6 hours

5. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Estimated effort: 6-8 hours

## 📋 Deployment Checklist

For production-ready deployment with full features:

- [ ] Set up MySQL database
- [ ] Configure proper JWT secret
- [ ] Set up SSL/TLS certificates (currently using Let's Encrypt)
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Add analytics (optional)
- [ ] Set up backup system
- [ ] Configure CDN for assets
- [ ] Add health check endpoint
- [ ] Set up logging
- [ ] Configure environment-specific settings

## 🎯 Roadmap

### Version 1.0 (Current) - Guest Mode ✅
- ✅ Basic editor with AI generation
- ✅ Guest mode (no auth required)
- ✅ Live preview
- ✅ Export functionality
- ✅ Beautiful UI
- ✅ Mobile responsive

### Version 1.1 (Next) - Polish
- [ ] Console panel toggle
- [ ] Auto-save indicator
- [ ] Better error messages
- [ ] More templates
- [ ] Code formatting
- [ ] Undo/redo

### Version 1.2 - Authentication (Optional)
- [ ] MySQL database setup
- [ ] User registration/login
- [ ] Save projects to database
- [ ] Project listing page
- [ ] Project sharing

### Version 2.0 - Advanced Features
- [ ] Git integration
- [ ] Deployment integration
- [ ] Asset management
- [ ] Code snippets library
- [ ] Multi-file search

### Version 3.0 - Collaboration
- [ ] Real-time collaborative editing
- [ ] Team workspaces
- [ ] Comments and reviews
- [ ] Version history

## 📝 Contributing

If you'd like to contribute to fixing issues or implementing improvements:

1. Check the issue list above
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## 📧 Reporting Issues

Found a bug? Please report it!

- **GitHub Issues**: [https://github.com/roichk069/ai-code-builder/issues](https://github.com/roichk069/ai-code-builder/issues)
- **Include**: Steps to reproduce, expected behavior, actual behavior, screenshots

## 🔄 Updates

This document is regularly updated as issues are fixed and new features are added.

**Last Updated**: 2026-02-08
