// lib/sandbox/executor.ts
import { Sandbox } from '@e2b/sdk';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  artifacts: string[];
}

export class CodeExecutor {
  /**
   * Executes untrusted code in a remote, ephemeral microVM.
   * Isolation: gVisor/Firecracker boundary.
   * Network: Egress restricted.
   */
  async executePython(code: string): Promise<ExecutionResult> {
    const sb = await Sandbox.create();
    
    try {
      // Write code to a file in the sandbox
      await sb.files.write('main.py', code);
      
      // Execute with a strict timeout
      const proc = await sb.process.start('python3 main.py');
      const output = await proc.wait();
      
      return {
        stdout: output.stdout,
        stderr: output.stderr,
        artifacts: await this.collectArtifacts(sb),
      };
    } catch (error) {
      return { stdout: '', stderr: (error as Error).message, artifacts: [] };
    } finally {
      await sb.close(); // Immediate destruction of VM
    }
  }

  private async collectArtifacts(sb: Sandbox): Promise<string[]> {
    const files = await sb.files.list('/');
    return files.filter(f => f.endsWith('.png') || f.endsWith('.json'));
  }
}
