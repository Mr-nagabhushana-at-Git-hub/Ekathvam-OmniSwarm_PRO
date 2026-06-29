// lib/security/redactor.ts
const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,}/g, // Generic API Key pattern
  /CEREBRAS_API_KEY=[^ \n]+/g,
  /AWS_SECRET_ACCESS_KEY=[^ \n]+/g
];

export function redactOutput(text: string): string {
  let sanitized = text;
  SECRET_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, "[REDACTED_SECRET]");
  });
  return sanitized;
}

// In sandbox_manager.ts
const output = await sandbox.run(code);
const safeOutput = redactOutput(output.stdout); 
stream.send({ event: 'node_output', data: safeOutput });
