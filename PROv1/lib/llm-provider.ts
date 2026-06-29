// lib/llm-provider.ts
import axios from 'axios';

export interface LLMOptions {
  prompt: string;
  provider: 'cerebras' | 'gpu';
  stream: boolean;
  isSwarm?: boolean;
}

export interface LLMResponse {
  text: string;
  tokens: number;
  ttft: number;
}

export async function callLLM({ prompt, provider, stream, isSwarm }: LLMOptions): Promise<ReadableStream | Promise<LLMResponse>> {
  const config = {
    cerebras: {
      url: 'https://api.cerebras.ai/v1/chat/completions',
      key: process.env.CEREBRAS_API_KEY,
      model: 'llama3.1-8b'
    },
    gpu: {
      url: 'https://api.groq.com/openai/v1/chat/completions', // Using Groq as high-end GPU baseline
      key: process.env.GPU_PROVIDER_API_KEY,
      model: 'llama3-70b-8192'
    }
  }[provider];

  const body = {
    model: config.model,
    messages: [{ role: 'user', content: prompt }],
    stream: stream,
    temperature: 0.1,
  };

  if (!stream) {
    const res = await axios.post(config.url, body, {
      headers: { Authorization: `Bearer ${config.key}` }
    });
    return {
      text: res.data.choices[0].message.content,
      tokens: res.data.usage.completion_tokens,
      ttft: 0 // Not applicable for non-streaming
    };
  }

  // Production-grade ReadableStream implementation for streaming
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${config.key}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(body),
  });

  if (!response.body) throw new Error("Response body is null");

  return new ReadableStream({
    async start(controller) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          // SSE format: "data: {...}"
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || "";
                controller.enqueue(content);
              } catch (e) { /* ignore partial JSON chunks */ }
            }
          }
        }
      } finally {
        controller.close();
      }
    }
  });
}
