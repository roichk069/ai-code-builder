export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface FileChange {
  path: string;
  content: string;
  action: 'create' | 'update' | 'delete';
}

export interface AIResponse {
  message: string;
  files?: FileChange[];
}

const SYSTEM_PROMPT = `You are an expert web developer AI assistant. Your role is to help users build web applications by generating, modifying, and improving code.

IMPORTANT RULES:
1. Always respond with valid, working code
2. Use modern best practices (ES6+, semantic HTML, responsive design)
3. Include Tailwind CSS for styling via CDN: <script src="https://cdn.tailwindcss.com"></script>
4. Make sure all code is complete and functional
5. When creating multiple files, structure them properly
6. Always include proper HTML structure with <!DOCTYPE html>
7. Make designs beautiful and modern
8. Add comments to explain complex code

When the user asks you to create or modify code, respond in this format:

---FILES---
[path=/index.html]
<full file content here>
[/path]

[path=/style.css]
<full file content here>
[/path]
---END_FILES---

IMPORTANT: Always include the complete file content, not just snippets.

Then after the files, provide a brief explanation of what you created/changed.`;

export async function generateCode(
  prompt: string,
  currentFiles: Map<string, string>,
  apiKey: string,
  model: string = 'anthropic/claude-3.5-sonnet'
): Promise<AIResponse> {
  const messages: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  // Add context of current files if they exist
  if (currentFiles.size > 0) {
    const filesContext = Array.from(currentFiles.entries())
      .map(([path, content]) => `File: ${path}\n\`\`\`\n${content}\n\`\`\``)
      .join('\n\n');
    messages.push({
      role: 'system',
      content: `Current project files:\n\n${filesContext}`,
    });
  }

  messages.push({ role: 'user', content: prompt });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'https://ai-code-builder.com',
        'X-Title': 'AI Code Builder',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || '';

    // Parse the response to extract files
    const files = parseFilesFromResponse(aiMessage);

    return {
      message: aiMessage,
      files,
    };
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

function parseFilesFromResponse(response: string): FileChange[] {
  const files: FileChange[] = [];

  // Look for the ---FILES--- section
  const filesMatch = response.match(/---FILES---([\s\S]*?)---END_FILES---/);

  if (filesMatch) {
    const filesSection = filesMatch[1];

    // Match individual files with [path=...] ... [/path] format
    const fileRegex = /\[path=(.*?)\]([\s\S]*?)\[\/path\]/g;
    let match;

    while ((match = fileRegex.exec(filesSection)) !== null) {
      const path = match[1].trim();
      const content = match[2].trim();

      files.push({
        path,
        content,
        action: 'create', // Default to create, could be enhanced to detect updates
      });
    }
  }

  return files;
}
