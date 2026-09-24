import { Request, Response } from 'express';
import { Tool } from '../models/Tool';

export const chatAssistant = async (req: Request, res: Response): Promise<any> => {
  try {
    const { messages } = req.body;
    
    // Fetch all tools to provide context
    const tools = await Tool.find({ status: 'approved' }).select('name description category rating');
    
    const toolsList = tools
      .slice(0, 30) // Limit to 30 tools to avoid token limits
      .map((t: any) => `- ${t.name}: ${t.description} (Category: ${t.category}, Rating: ${t.rating}/5)`)
      .join('\n');

    const systemPrompt = `You are a friendly and knowledgeable AI Tools Assistant. You help people discover amazing AI tools in a conversational, natural way - like chatting with a friend who knows a lot about AI.

AI tools database:
${toolsList}

How to respond:
- Be friendly, casual, and engaging - use natural language
- When recommending tools, explain WHY they're good in a conversational way
- Share opinions and insights, not just facts
- Ask follow-up questions to understand what they really need
- Be helpful but not robotic - use personality and humor when appropriate
- Keep it concise but warm (3-4 sentences is good)
- Mention ratings and categories when relevant
- If you suggest multiple tools, briefly explain what makes each one special
- Share tips and insights about the tools you know

Remember: You're helping people discover tools they'll love. Make it feel like a real conversation, not a database lookup.`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GROQ_API_KEY is not configured in the backend' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 450,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || '';

    // Find mentioned tools
    const mentionedTools = tools.filter((tool: any) => reply.toLowerCase().includes(tool.name.toLowerCase()));

    res.json({ message: reply, tools: mentionedTools });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
