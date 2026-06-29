// lib/core/telemetry.ts
import { trace, SpanStatusCode, ValueType } from '@opentelemetry/api';

const tracer = trace.getTracer('omniswarm-orchestrator');

export async function traceAgentNode<T>(
  nodeId: string, 
  role: string, 
  fn: () => Promise<T>
): Promise<T> {
  return tracer.startActiveSpan(`gen_ai.operation.execute ${role}`, async (span) => {
    span.setAttributes({
      'gen_ai.node.id': nodeId,
      'gen_ai.operation.name': 'execute_tool',
      'gen_ai.provider.name': 'cerebras',
    });

    try {
      const result = await fn();
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
