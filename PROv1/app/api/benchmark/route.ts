// app/api/benchmark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm-provider';
import { encode } from 'gpt-tokenizer';

export async function POST(req: NextRequest) {
  const { prompt, provider, mode } = await req.json();
  
  const start = performance.now();
  let firstTokenTime = 0;
  let fullText = "";

  try {
    const stream = await callLLM({
      prompt,
      provider,
      stream: true,
      isSwarm: mode === 'swarm'
    }) as ReadableStream;

    const reader = stream.getReader();
    
    // 1. Capture TTFT (Time to First Token)
    const { done: firstDone, value: firstChunk } = await reader.read();
    if (firstDone || !firstChunk) throw new Error("Stream ended prematurely");
    
    firstTokenTime = performance.now() - start;
    fullText += firstChunk;

    // 2. Consume stream to capture full output
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      if (chunk) fullText += chunk;
    }

    const end = performance.now();
    
    // 3. Accurate Token Counting using gpt-tokenizer
    const tokens = encode(fullText).length;
    
    // 4. Correct TPS Calculation
    // Generation duration is the time from first token to last token
    const generationDurationSeconds = (end - (start + firstTokenTime)) / 1000;
    const tps = generationDurationSeconds > 0 ? tokens / generationDurationSeconds : 0;

    return NextResponse.json({
      ttft: firstTokenTime,
      tps: tps,
      tokens: tokens,
      wallTime: end - start
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
