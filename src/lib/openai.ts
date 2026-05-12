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

  return `You are an expert AI Tools Assistant that helps users discover, evaluate, and compare AI tools.

Your knowledge base includes these AI tools:
${toolsList}

Your responsibilities:
1. RECOMMEND relevant tools based on user needs and use cases
2. COMPARE tools when asked, highlighting pros and cons
3. ANALYZE tool features and pricing carefully
4. SUGGEST alternative tools if the user's needs aren't met
5. PROVIDE honest assessments about tool limitations
6. ANSWER questions about AI tools in general

Guidelines:
- Be conversational and helpful, not robotic
- If a tool is not in your knowledge base, say so clearly
- For tool recommendations, explain WHY each tool is suitable
- Ask clarifying questions when the user's needs are unclear
- Prioritize tools with higher ratings when possible
- Consider the user's budget and technical skill level
- Mention if a tool offers a free tier or trial
- Suggest tool combinations that work well together

Always cite the specific tools by name when recommending them from your knowledge base.`;
}

/**
 * Call OpenAI API with streaming support
 */
export async function callOpenAI(
  messages: AssistantMessage[],
  systemPrompt: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Extract mentioned tool names from assistant response
 */
export function extractToolNames(response: string, tools: AITool[]): AITool[] {
  const mentionedTools: AITool[] = [];
  const toolNames = tools.map(t => t.name.toLowerCase());

  for (const tool of tools) {
    if (response.toLowerCase().includes(tool.name.toLowerCase())) {
      mentionedTools.push(tool);
    }
  }

  // Remove duplicates
  return Array.from(new Map(mentionedTools.map(t => [t.id, t])).values());
}
