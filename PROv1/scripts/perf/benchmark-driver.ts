// scripts/perf/benchmark-driver.ts
import fs from 'node:fs';
import axios from 'axios';
import { MetricsCollector } from './metrics-collector.js';

// Use standard process.env for Node.js scripts
const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const TEST_SUITES = JSON.parse(fs.readFileSync('./scripts/perf/test-suites.json', 'utf8'));
const collector = new MetricsCollector();

async function runTest(provider: 'cerebras' | 'gpu', profileName: string) {
  const profile = TEST_SUITES.profiles[profileName];
  console.log(`\n🚀 Testing ${profileName} on ${provider.toUpperCase()}...`);

  for (let i = 0; i < profile.iterations; i++) {
    const prompt = profile.prompts[i % profile.prompts.length];
    const start = process.hrtime.bigint();
    
    try {
      const response = await axios.post(`${API_BASE}/api/benchmark`, {
        prompt,
        provider,
        mode: profileName === 'swarm_test' ? 'swarm' : 'single'
      });

      const end = process.hrtime.bigint();
      const wallTime = Number(end - start) / 1_000_000;

      collector.add({
        provider,
        ttft: response.data.ttft,
        tps: response.data.tps,
        wallTime: wallTime,
        tokens: response.data.tokens
      });

      console.log(`  [Iter ${i+1}] TTFT: ${response.data.ttft.toFixed(2)}ms | TPS: ${response.data.tps.toFixed(2)}`);
    } catch (e: any) {
      console.error(`  ❌ Iter ${i+1} failed: ${e.message}`);
    }
  }
}

async function main() {
  const providers: ('cerebras' | 'gpu')[] = ['gpu', 'cerebras'];
  const profiles = Object.keys(TEST_SUITES.profiles);

  console.log("=== OmniSwarm PROv1 Performance Benchmark ===");
  
  for (const profile of profiles) {
    for (const provider of providers) {
      await runTest(provider, profile);
    }
  }

  const report = collector.generateReport();
  console.log("\n" + "=".repeat(50));
  console.log("📊 FINAL PERFORMANCE REPORT");
  console.log("=".repeat(50));
  console.table(report);
  
  fs.writeFileSync('./perf-results.json', JSON.stringify(report, null, 2));
}

main().catch(console.error);
