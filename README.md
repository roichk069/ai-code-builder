# 🚀 AI Code Builder

An AI-powered full-stack code generator with live preview, inspired by Lovable.dev and Bolt.new. Build complete websites using natural language!

## ✨ Features

- **AI Code Generation** - Generate complete, working code from natural language descriptions
- **Live Code Editor** - Monaco Editor (VS Code) with syntax highlighting
- **Real-time Preview** - Sandboxed iframe with instant updates
- **Multi-file Support** - Create and manage complex projects
- **File Tree** - Visual file explorer
- **Terminal** - Built-in console for logs and errors
- **Iterative Refinement** - Chat to modify existing code
- **Templates** - Quick start with pre-built templates (Landing Page, Blog, Dashboard)
- **Export/Download** - Download your project as ZIP
- **Multiple AI Models** - Support for Claude 3.5 Sonnet, GPT-4, and more via OpenRouter

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Code Editor**: Monaco Editor
- **AI**: OpenRouter API (supports OpenAI & Anthropic)
- **State Management**: Zustand
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai/keys))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-code-builder
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

1. Click the **Settings** icon (gear) in the top right of the editor
2. Enter your **OpenRouter API Key**
3. Select your preferred **AI Model** (Claude 3.5 Sonnet recommended)
4. Click **Save Settings**

## 📖 How to Use

### Method 1: Start from a Template

1. On the homepage, click **Browse Templates**
2. Select a template (Landing Page, Blog, Dashboard, or Blank)
3. The editor will open with the template loaded
4. Chat with AI to modify and enhance the template

### Method 2: Start from Scratch

1. Click **Open Editor** or **Start Building Free**
2. In the chat interface, describe what you want to build:
   - "Create a modern landing page for a SaaS product"
   - "Build a blog with a sidebar and 3 posts"
   - "Make a dashboard with charts and statistics"
3. AI will generate the code and display it in the editor
4. The preview updates in real-time

### Making Changes

- **Chat with AI**: Continue the conversation to refine your project
  - "Add a contact form to the page"
  - "Change the color scheme to blue"
  - "Make it responsive for mobile"
- **Edit Manually**: Click files in the tree to edit them directly in the Monaco editor
- **Add New Files**: Click the **+** button in the file tree

### Export Your Project

1. Click **Export** in the top menu
2. Your project will be downloaded as a ZIP file
3. Extract and open `index.html` in a browser

## 🎨 Project Structure

```
ai-code-builder/
├── app/
│   ├── page.tsx              # Landing page
│   ├── editor/page.tsx       # Main IDE interface
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── chat/                 # Chat interface
│   ├── editor/               # Monaco editor wrapper
│   ├── file-tree/            # File explorer
│   ├── preview/              # Live preview iframe
│   ├── terminal/             # Console logs
│   ├── templates/            # Template selector
│   ├── settings/             # Settings modal
│   └── ui/                   # UI components (buttons, etc.)
├── lib/
│   ├── ai.ts                 # AI integration (OpenRouter)
│   ├── fs.ts                 # Virtual file system
│   ├── store.ts              # Zustand state management
│   ├── templates.ts          # Pre-built templates
│   └── utils.ts              # Utilities
└── public/                   # Static assets
```

## 🤖 AI Models

The app supports multiple AI models via OpenRouter:

- **Claude 3.5 Sonnet** (Recommended) - Best for code generation
- Claude 3 Opus - Most capable, slower
- GPT-4 Turbo - Fast and capable
- GPT-4 - High quality
- GPT-3.5 Turbo - Fast and cheap

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

### Manual Server Deployment

1. Build the app:
```bash
npm run build
```

2. Copy the `.next`, `public`, `node_modules`, `package.json`, and `next.config.ts` to your server

3. Run with PM2:
```bash
pm2 start npm --name "ai-code-builder" -- start
```

4. Configure Nginx as reverse proxy (port 3000)

## 🌐 Environment Variables

Create a `.env.local` file for server-side configuration:

```env
# Optional: Set a default API key (not recommended for security)
# NEXT_PUBLIC_DEFAULT_API_KEY=your_openrouter_key
```

## 📝 Tips

- Be specific in your prompts for better results
- Start with a template and iterate
- Use the console to debug issues
- Export frequently to backup your work
- Try different AI models for different tasks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by [Lovable.dev](https://lovable.dev) and [Bolt.new](https://bolt.new)
- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

Made with ❤️ and AI
