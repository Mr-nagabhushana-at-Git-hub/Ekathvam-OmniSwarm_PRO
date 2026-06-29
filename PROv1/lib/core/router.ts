// lib/core/router.ts

export type ModelTier = 'FAST' | 'VISION' | 'REASONING' | 'CRITIC';

export class ModelRouter {
  private static config = {
    FAST: { provider: 'cerebras', model: 'gpt-oss-120b' }, // 3000 tok/s
    VISION: { provider: 'cerebras', model: 'gemma-4-31b' }, // Multimodal
    REASONING: { provider: 'anthropic', model: 'claude-3-5-sonnet' },
    CRITIC: { provider: 'openai', model: 'gpt-4o' }, // High-precision judge
  };

  static getRoute(tier: ModelTier) {
    return this.config[tier];
  }

  static async routeRequest(input: any) {
    // Auto-detect if input contains images/files
    if (input.images || input.files) {
      return this.getRoute('VISION');
    }
    return this.getRoute('FAST');
  }
}
