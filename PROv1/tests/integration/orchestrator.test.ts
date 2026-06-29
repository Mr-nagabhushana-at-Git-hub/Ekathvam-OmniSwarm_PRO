// tests/integration/orchestrator.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SwarmOrchestrator } from '@/lib/core/orchestrator';
import { ModelProvider } from '@/lib/core/providers';

// Mock the LLM Provider to avoid API costs and non-determinism
vi.mock('@/lib/core/providers');

describe('SwarmOrchestrator Integration', () => {
  let orchestrator: SwarmOrchestrator;

  beforeEach(() => {
    orchestrator = new SwarmOrchestrator();
    vi.clearAllMocks();
  });

  it('should execute the full DAG sequence in correct order', async () => {
    const prompt = 'Analyze the impact of quantum computing on RSA encryption';
    
    // Mock sequential responses for the pipeline
    (ModelProvider.callLLM as any)
      .mockResolvedValueOnce({ content: 'PLAN: [Research, Analyze, Synthesize]' }) // Planner
      .mockResolvedValueOnce({ content: 'RESEARCH: Quantum Shor algorithm details' }) // Research
      .mockResolvedValueOnce({ content: 'SWARM: Multi-perspective analysis' }) // Swarm
      .mockResolvedValueOnce({ content: 'FINAL: Comprehensive Report' }); // Synth

    const result = await orchestrator.run(prompt);

    expect(result.finalArtifact).toBe('FINAL: Comprehensive Report');
    expect(ModelProvider.callLLM).toHaveBeenCalledTimes(4);
    
    // Verify the sequence of calls via mock call order
    const calls = (ModelProvider.callLLM as any).mock.calls;
    expect(calls[0][0]).toContain('planner');
    expect(calls[1][0]).toContain('research');
    expect(calls[2][0]).toContain('swarm');
    expect(calls[3][0]).toContain('synthesizer');
  });

  it('should recover and synthesize even if one swarm agent fails', async () => {
    (ModelProvider.callLLM as any)
      .mockResolvedValueOnce({ content: 'PLAN: [AgentA, AgentB]' })
      .mockRejectedValueOnce(new Error('Cerebras Timeout')) // Agent A fails
      .mockResolvedValueOnce({ content: 'Agent B success' }) // Agent B succeeds
      .mockResolvedValueOnce({ content: 'Synthesis from Agent B' });

    const result = await orchestrator.run('Test Resilience');
    
    expect(result.finalArtifact).toBe('Synthesis from Agent B');
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Cerebras Timeout');
  });
});
