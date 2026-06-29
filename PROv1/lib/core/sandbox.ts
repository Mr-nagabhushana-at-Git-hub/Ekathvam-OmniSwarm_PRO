// lib/core/sandbox.ts
import { E2B_SDK } from '@e2b/sdk'; // Using E2B as the production-grade gVisor wrapper

export interface SandboxResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  artifacts: Record<string, string>;
}

export class CodeSandbox {
  private sandbox: any;

  async init() {
    // Initialize a disposable microVM
    this.sandbox = await E2B_SDK.Sandbox.create({
      template: 'python_latest',
      timeout: 30, // Hard wall-clock timeout
    });
  }

  async execute(code: string): Promise<SandboxResult> {
    try {
      // Execute code in the isolated VM
      const result = await this.sandbox.process.start({
        cmd: 'python3',
        args: ['-c', code],
      });

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        artifacts: await this.sandbox.files.list(),
      };
    } catch (error: any) {
      return {
        stdout: '',
        stderr: error.message,
        exitCode: 1,
        artifacts: {},
      };
    } finally {
      await this.sandbox.close(); // Immediate destruction
    }
  }
}
