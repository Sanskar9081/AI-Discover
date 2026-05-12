import type { AITool } from '@/data/tools';

interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Create a system prompt with tool context
 */
export function createSystemPrompt(tools: AITool[]): string {
  const toolsList = tools
    .slice(0, 30) // Limit to 30 tools to avoid token limits
    .map(t => `- ${t.name}: ${t.description} (Category: ${t.category}, Rating: ${t.rating}/5)`)
    .join('\n');

  return `You are a friendly and knowledgeable AI Tools Assistant. You help people discover amazing AI tools in a conversational, natural way - like chatting with a friend who knows a lot about AI.

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
}

/**
 * Call Groq API (FREE and FAST!)
 */
export async function callGroq(
  messages: AssistantMessage[],
  systemPrompt: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Latest production model with best accuracy
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 450, // Allow natural conversational responses
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

/**
 * Extract mentioned tool names from assistant response
 */
export function extractToolNames(response: string, tools: AITool[]): AITool[] {
  const mentionedTools: AITool[] = [];

  for (const tool of tools) {
    if (response.toLowerCase().includes(tool.name.toLowerCase())) {
      mentionedTools.push(tool);
    }
  }

  // Remove duplicates
  return Array.from(new Map(mentionedTools.map(t => [t.id, t])).values());
}
