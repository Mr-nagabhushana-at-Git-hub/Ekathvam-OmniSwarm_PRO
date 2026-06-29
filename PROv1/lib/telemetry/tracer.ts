// lib/telemetry/tracer.ts
import { trace, SpanStatusCode, ValueType } from '@opentelemetry/api';
import { NodeOTLPTraceExporter } from '@opentelemetry/exporter-node-otlp-grpc';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'omniswarm-orchestrator',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0-pro',
  }),
});

provider.addSpanProcessor(new BatchSpanProcessor(new NodeOTLPTraceExporter()));
provider.register();

export const tracer = trace.getTracer('omniswarm-core');

/**
 * Wraps an agent node execution in a trace span with GenAI conventions
 */
export async function traceAgentNode<T>(
  nodeId: string,
  role: string,
  model: string,
  fn: () => Promise<{ result: T; tokens: { input: number; output: number } }>
): Promise<T> {
  return tracer.startActiveSpan(`gen_ai.operation.execute ${role}`, async (span) => {
    span.setAttributes({
      'gen_ai.node.id': nodeId,
      'gen_ai.request.model': model,
      'gen_ai.operation.name': 'chat',
    });

    try {
      const { result, tokens } = await fn();
      
      span.setAttributes({
        'gen_ai.usage.input_tokens': tokens.input,
        'gen_ai.usage.output_tokens': tokens.output,
      });
      
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (e: any) {
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: e.message 
      });
      span.recordException(e);
      throw e;
    } finally {
      span.end();
    }
  });
}
