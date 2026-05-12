# AI Assistant Setup Guide

## Overview
The AI Assistant now supports intelligent conversations powered by OpenAI's GPT-3.5 Turbo model. When available, it provides smart recommendations, comparisons, and analysis of AI tools with full context knowledge.

## Features
✅ **AI-Powered Recommendations** - Get intelligent tool suggestions based on your needs
✅ **Tool Comparisons** - Compare tools intelligently with pros and cons  
✅ **Conversational** - Natural, multi-turn conversations
✅ **Fallback Mode** - Works with local search if API key isn't configured
✅ **Floating Widget** - Quick access chatbot on homepage
✅ **Full Page View** - Dedicated assistant page at `/assistant`

## Setup Instructions

### 1. Get an OpenAI API Key
1. Go to https://platform.openai.com/account/api-keys
2. Sign up or log in to your OpenAI account
3. Create a new API key
4. Copy the key (you won't see it again!)

### 2. Configure Environment Variable
Create a `.env.local` file in the project root:

```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

**Important**: 
- Never commit `.env.local` to Git
- The key starts with `sk-`
- It should be in `.env.local`, not just `.env` (Vite requires this)

### 3. Verify Setup
After setting up:
1. Run `npm run dev`
2. Open the assistant (floating button or `/assistant` page)
3. Try asking: "What are the best AI tools for video generation?"
4. The assistant should provide intelligent recommendations with OpenAI

### 4. Cost Estimates
- GPT-3.5-Turbo: ~$0.002 per 1K input tokens, ~$0.004 per 1K output tokens
- A typical assistant query uses ~200-500 tokens
- 1000 queries might cost $2-5

## How It Works

### With OpenAI API Key
```
User Input → OpenAI API (with tool context) → Extract mentioned tools → Display response + tool cards
```

System prompt includes:
- All available AI tools (name, description, category, rating)
- Instructions to recommend, compare, and analyze tools
- Guidelines for honest assessments

### Without API Key (Fallback)
```
User Input → Local keyword search → Find matching tools → Display results
```

Falls back to keyword matching in tool names, descriptions, and categories.

## Troubleshooting

### "Invalid API key" Error
- Check the key starts with `sk-`
- Verify it's in `.env.local` (not `.env`)
- Restart the dev server after updating `.env.local`
- Regenerate the key if unsure

### Assistant not responding
- Check browser console (F12 → Console)
- Ensure network request to `api.openai.com` isn't blocked
- Verify API key has credits available
- Try the fallback mode (works without API key)

### Slow responses
- GPT-3.5-Turbo typically responds in 1-3 seconds
- Check your internet connection
- API might be experiencing high load

## Security Notes
⚠️ Never expose your API key in:
- Source code
- Git commits
- Frontend bundles
- Public documentation

The key is only used server-side through the frontend's environment variables, but keep it secret!

## Future Enhancements
Potential improvements:
- Streaming responses for better UX
- Tool usage history and analytics
- User preferences/favorites in assistant
- Multi-language support
- Conversation history persistence
- Image generation with tools

## Dashboard Status
The assistant status shows in the Admin panel (Settings tab) for future monitoring.
