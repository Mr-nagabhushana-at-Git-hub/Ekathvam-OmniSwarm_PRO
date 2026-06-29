// lib/core/types.ts

export type EventType = 
  | 'telemetry'       // System health, TPS, TTFT
  | 'node_start'      // Agent begins work
  | 'node_update'     // Agent is streaming intermediate thought
  | 'node_complete'   // Agent finished; output stored
  | 'judge_verdict'   // Critic's score and decision
  | 'synth_token'     // Final result token (Incremental)
  | 'artifact'        // Code/HTML/PDF generated
  | 'error';

export interface SwarmEvent {
  id: string;           // Unique event ID
  timestamp: number;    // Epoch ms
  type: EventType;
  nodeId?: string;      // Which agent emitted this
  payload: any;         // Event-specific data
}

export interface JudgeVerdict {
  score: number;        // 0.0 to 1.0
  confidence: number;   // 0.0 to 1.0
  rubric: {
    accuracy: number;
    completeness: number;
    provenance: number;
  };
  decision: 'PASS' | 'REJECT';
  feedback: string;     // Instructions for the synthesizer to improve
}

export interface ProvenanceSource {
  url: string;
  snippet: string;
  confidence: number;
  timestamp: string;
}
