# Developer Writing Assistant - Standalone App Build Guide

This guide provides complete instructions for building a standalone Developer Writing Assistant app that uses AI to rewrite content according to Luke's developer writing style guide.

## Overview

The Developer Writing Assistant is a web application that:
- Accepts user content input
- Sends it to OpenAI's GPT-4o API with your style guide
- Returns AI-rewritten content following your developer writing principles
- Provides a clean, two-panel UI (input on left, output on right)

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **AI**: OpenAI API (GPT-4o)
- **Deployment**: Can be hosted on Vercel, Render, Railway, or any Node.js hosting

---

## File Structure

```
developer-writing-assistant/
├── public/
│   ├── index.html
│   └── style.css
├── server.js
├── style-guide.txt
├── package.json
└── .env
```

---

## Step 1: Initialize Project

```bash
mkdir developer-writing-assistant
cd developer-writing-assistant
npm init -y
npm install express openai dotenv cors
```

---

## Step 2: Add Your Style Guide File

**Option 1: Copy your existing file**

Copy `Lukes-Developer-Writing-Style.md` from your main project into the standalone app folder:

```bash
cp /path/to/Lukes-Developer-Writing-Style.md ./style-guide.txt
```

**Option 2: Create from scratch**

If you don't have the file, create `style-guide.txt` with your complete style guide content. The file should include all your writing principles, banned words, tone guidelines, etc.

**Important**: The server.js code reads this file at startup, so any changes to the style guide will require restarting the server.

---

## Step 3: Create Backend Server

Create `server.js`:

```javascript
const express = require('express');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Read style guide once at startup
const styleGuide = fs.readFileSync(path.join(__dirname, 'style-guide.txt'), 'utf-8');

// API endpoint to rewrite content
app.post('/api/rewrite', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || typeof content !== 'string') {
            return res.status(400).json({ error: 'Content is required' });
        }

        // Create the prompt with strict instructions
        const prompt = `${styleGuide}

---

CRITICAL: You MUST follow these style guide rules strictly:

1. NEVER use these banned words/phrases: "game-changing," "cutting-edge," "unleash," "seamlessly," "robustly," "robust," "very," "often," "typically," "virtually," "synergy," "leverage," "paradigm," "revolutionary"
2. NEVER use empty superlatives or marketing fluff
3. NEVER start with "Let's explore" or "In this post"
4. Replace vague adverbs with specific facts
5. Use active voice and direct language

Please rewrite the following content to match the style guide above. Keep the core message and information intact, but adjust the tone, voice, and structure to align with these developer writing principles.

Return ONLY the rewritten content, without any preamble or explanation.

Content to rewrite:

${content}`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{
                role: 'user',
                content: prompt
            }],
            max_tokens: 4096
        });

        const rewrittenContent = completion.choices[0]?.message?.content || '';

        res.json({
            success: true,
            rewritten: rewrittenContent
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Failed to rewrite content',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Step 4: Create Frontend HTML

Create `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Developer Writing Assistant</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="title">Developer Writing Assistant</h1>
            <p class="subtitle">Use AI to rewrite your content in Luke's developer writing style</p>
        </header>

        <div class="main-content">
            <!-- Input Panel -->
            <div class="panel input-panel">
                <div class="panel-header">
                    <h3>Your Content</h3>
                    <button id="clearInput" class="btn btn-secondary">Clear</button>
                </div>
                <textarea
                    id="contentInput"
                    class="content-textarea"
                    placeholder="Paste your content here that you want to rewrite in Luke's style..."
                ></textarea>
            </div>

            <!-- Output Panel -->
            <div class="panel output-panel">
                <div class="panel-header">
                    <h3>AI Rewrite</h3>
                    <div class="output-actions">
                        <button id="rewriteBtn" class="btn btn-primary">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            Rewrite with AI
                        </button>
                        <button id="copyOutput" class="btn btn-secondary" style="display: none;">
                            <i class="fa-solid fa-copy"></i>
                            Copy
                        </button>
                    </div>
                </div>
                <div id="contentOutput" class="content-output">
                    <div class="empty-state">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <p>Paste your content on the left, then click "Rewrite with AI" to get it rewritten in Luke's developer writing style</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## Step 5: Create Frontend JavaScript

Create `public/script.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const clearBtn = document.getElementById('clearInput');
    const rewriteBtn = document.getElementById('rewriteBtn');
    const copyBtn = document.getElementById('copyOutput');
    const input = document.getElementById('contentInput');
    const output = document.getElementById('contentOutput');

    let rewrittenContent = '';

    // Clear input
    clearBtn.addEventListener('click', () => {
        input.value = '';
        rewrittenContent = '';
        output.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <p>Paste your content on the left, then click "Rewrite with AI" to get it rewritten in Luke's developer writing style</p>
            </div>
        `;
        copyBtn.style.display = 'none';
    });

    // Rewrite with AI
    rewriteBtn.addEventListener('click', async () => {
        const content = input.value;
        if (!content.trim()) {
            alert('Please paste some content first');
            return;
        }

        // Show loading state
        output.innerHTML = `
            <div class="loading-state">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <p>AI is rewriting your content in Luke's style...</p>
            </div>
        `;
        rewriteBtn.disabled = true;
        rewriteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Rewriting...';

        try {
            const response = await fetch('/api/rewrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to rewrite content');
            }

            rewrittenContent = data.rewritten;

            // Show rewritten content
            output.innerHTML = `
                <div class="rewritten-content">
                    <div class="rewrite-info">
                        <i class="fa-solid fa-circle-check"></i>
                        <p>Content rewritten in Luke's developer writing style</p>
                    </div>
                    <div class="rewritten-text">${escapeHtml(rewrittenContent).replace(/\n/g, '<br>')}</div>
                </div>
            `;
            copyBtn.style.display = 'flex';
        } catch (error) {
            console.error('Error:', error);
            output.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p>Failed to rewrite content. Please try again.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        } finally {
            rewriteBtn.disabled = false;
            rewriteBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Rewrite with AI';
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        if (!rewrittenContent) return;

        try {
            await navigator.clipboard.writeText(rewrittenContent);
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            alert('Failed to copy to clipboard. Please try again.');
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
```

---

## Step 6: Create Frontend CSS

Create `public/style.css`:

```css
:root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --accent-primary: #60a5fa;
    --accent-hover: #3b82f6;
    --border-color: rgba(255, 255, 255, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

.header {
    text-align: center;
    margin-bottom: 3rem;
}

.title {
    font-family: 'Fira Code', monospace;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
}

.main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    height: calc(100vh - 200px);
}

.panel {
    display: flex;
    flex-direction: column;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.panel-header h3 {
    font-family: 'Fira Code', monospace;
    font-size: 1rem;
    font-weight: 600;
}

.output-actions {
    display: flex;
    gap: 0.5rem;
}

.btn {
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
}

.btn-primary {
    background: var(--accent-primary);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: var(--accent-hover);
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
}

.content-textarea {
    flex: 1;
    width: 100%;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    line-height: 1.6;
    resize: none;
    outline: none;
}

.content-textarea:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.content-textarea::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
}

.content-output {
    flex: 1;
    overflow-y: auto;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
}

.empty-state,
.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    text-align: center;
}

.empty-state i,
.loading-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.loading-state i {
    color: var(--accent-primary);
}

.error-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ef4444;
}

.error-details {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: 0.5rem;
}

.rewritten-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
}

.rewrite-info {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 6px;
}

.rewrite-info i {
    color: #22c55e;
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 2px;
}

.rewrite-info p {
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
}

.rewritten-text {
    flex: 1;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 1.5rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--text-primary);
    overflow-y: auto;
    overflow-x: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

@media (max-width: 768px) {
    .main-content {
        grid-template-columns: 1fr;
        height: auto;
    }

    .panel {
        min-height: 400px;
    }
}
```

---

## Step 7: Create Environment File

Create `.env`:

```env
OPENAI_API_KEY=your-openai-api-key-here
PORT=3000
```

---

## Step 8: Update package.json

Update your `package.json` with start script:

```json
{
  "name": "developer-writing-assistant",
  "version": "1.0.0",
  "description": "AI-powered writing assistant for developer content",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.20.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## Step 9: Run the App

```bash
# Development
npm run dev

# Production
npm start
```

Visit `http://localhost:3000` in your browser.

---

## Deployment Options

### Option 1: Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy

### Option 2: Render

1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add `OPENAI_API_KEY` environment variable
5. Deploy

### Option 3: Railway

1. Connect GitHub repo
2. Add `OPENAI_API_KEY` environment variable
3. Deploy automatically

---

## Security Considerations

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Keep style guide private** - Add `style-guide.txt` to `.gitignore` to prevent sharing your proprietary writing style
3. **Rate limiting** - Add rate limiting to prevent API abuse
4. **Authentication** - Consider adding basic auth if making public
5. **API key security** - Keep OpenAI key server-side only
6. **Make the app private** - Since this contains your unique developer writing style, consider keeping this tool private for personal use only, or add authentication before sharing publicly

---

## Cost Considerations

- GPT-4o costs approximately $5 per 1M input tokens and $15 per 1M output tokens
- Average rewrite might use 2,000 tokens = $0.04 per request
- Budget accordingly based on expected usage

---

## Future Enhancements

- Add authentication (email/password or OAuth)
- Store rewrite history in database
- Add multiple style guides
- Export functionality (PDF, Markdown)
- Batch processing
- Version comparison (before/after)

---

## Troubleshooting

**Issue**: API key not working
- Verify key is correct in `.env`
- Check OpenAI account has credits
- Restart server after changing `.env`

**Issue**: CORS errors
- Ensure `cors` middleware is enabled
- Check API endpoint URL is correct

**Issue**: Slow responses
- GPT-4o can take 5-10 seconds for longer content
- Consider adding streaming for real-time output
- Show loading states to improve UX

---

## Reference Files

All the code from this guide can be found in the `feature/content-linter-experiment` git branch of your main project for reference.
