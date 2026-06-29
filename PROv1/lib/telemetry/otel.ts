// lib/telemetry/otel.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace } from '@opentelemetry/api';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'omniswarm-orchestrator',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0-pro',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }),
});

sdk.start();

export const tracer = trace.getTracer('omniswarm-genai');

/**
 * Wraps an LLM call with GenAI semantic conventions.
 */
export async function traceLLMCall<T>(
  modelName: string, 
  operation: 'chat' | 'embeddings', 
  fn: () => Promise<T>
): Promise<T> {
  return tracer.startActiveSpan(`gen_ai.${operation} ${modelName}`, async (span) => {
    span.setAttribute('gen_ai.request.model', modelName);
    span.setAttribute('gen_ai.operation.name', operation);
    
    const start = Date.now();
    try {
      const result = await fn();
      // In a real scenario, extract tokens from result
      span.setAttribute('gen_ai.usage.output_tokens', 0); 
      return result;
    } catch (e) {
      span.setStatus({ code: 2, message: (e as Error).message });
      throw e;
    } finally {
      span.setAttribute('duration_ms', Date.now() - start);
      span.end();
    }
  });
}
