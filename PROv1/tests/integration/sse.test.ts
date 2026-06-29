// tests/integration/sse.test.ts
import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';

describe('SSE Stream Protocol Validation', () => {
  const API_URL = 'http://localhost:3000/api/swarm';

  it('should emit correctly formatted SSE frames with telemetry', async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Test SSE' }),
    });

    expect(response.headers.get('content-type')).toBe('text/event-stream');
    expect(response.headers.get('cache-control')).toBe('no-cache');

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    let framesReceived = 0;
    const decoder = new TextDecoder();

    // Read the first 3 frames
    while (framesReceived < 3) {
      const { value } = await reader.read();
      if (!value) break;
      
      const chunk = decoder.decode(value, { stream: true });
      
      // Validate SSE Format: "event: <name>\ndata: <json>\n\n"
      expect(chunk).toMatch(/event: (telemetry|chunk|done)/);
      expect(chunk).toMatch(/data: \{.*\}/);
      
      framesReceived++;
    }
  });

  it('should maintain connection via heartbeats', async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ prompt: 'Long run' }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    // Wait for a heartbeat (comment starting with :)
    let heartbeatFound = false;
    for (let i = 0; i < 10; i++) {
      const { value } = await reader!.read();
      if (value && decoder.decode(value).includes(': ping')) {
        heartbeatFound = true;
        break;
      }
    }
    expect(heartbeatFound).toBe(true);
  });
});
