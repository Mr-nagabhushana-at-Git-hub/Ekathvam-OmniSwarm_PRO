// app/api/swarm/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { OmniSwarmEngine } from '@/lib/core/orchestrator';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { prompt, images } = await req.json();
  const engine = new OmniSwarmEngine();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      const sendEvent = (event: any) => {
        controller.enqueue(encoder.encode(`event: swarm_update\ndata: ${JSON.stringify(event)}\n\n`));
      };

      try {
        await engine.execute(prompt, images || [], sendEvent);
        controller.enqueue(encoder.encode(`event: done\ndata: {"status": "success"}\n\n`));
      } catch (e: any) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: e.message })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
