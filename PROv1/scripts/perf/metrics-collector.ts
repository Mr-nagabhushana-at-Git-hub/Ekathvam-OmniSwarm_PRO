// scripts/perf/metrics-collector.ts
export interface RawMetric {
  provider: 'cerebras' | 'gpu';
  ttft: number;
  tps: number;
  wallTime: number;
  tokens: number;
}

export class MetricsCollector {
  private data: RawMetric[] = [];

  add(metric: RawMetric) { this.data.push(metric); }

  private calculateP95(values: number[]) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.ceil(sorted.length * 0.95) - 1];
  }

  generateReport() {
    const providers = ['cerebras', 'gpu'] as const;
    const report: any = {};

    providers.forEach(p => {
      const subset = this.data.filter(d => d.provider === p);
      if (subset.length === 0) return;

      report[p] = {
        avgTTFT: subset.reduce((a, b) => a + b.ttft, 0) / subset.length,
        p95TTFT: this.calculateP95(subset.map(d => d.ttft)),
        avgTPS: subset.reduce((a, b) => a + b.tps, 0) / subset.length,
        p95WallTime: this.calculateP95(subset.map(d => d.wallTime)),
        totalTokens: subset.reduce((a, b) => a + b.tokens, 0),
      };
    });

    const c = report.cerebras;
    const g = report.gpu;
    
    if (c && g) {
      report.delta = {
        // CORRECTED: Cerebras TPS / GPU TPS = Speedup Multiplier
        speedupMultiplier: (c.avgTPS / g.avgTPS).toFixed(2) + 'x',
        latencyReduction: (((g.p95WallTime - c.p95WallTime) / g.p95WallTime * 100).toFixed(2)) + '%',
        ttftImprovement: (g.avgTTFT - c.avgTTFT).toFixed(2) + 'ms'
      };
    }

    return report;
  }
}
