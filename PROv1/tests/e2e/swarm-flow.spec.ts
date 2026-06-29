// tests/e2e/swarm-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('OmniSwarm PROv1 E2E Journey', () => {
  test('should execute a full swarm run and render the final artifact', async ({ page }) => {
    await page.goto('/');

    // 1. Interaction: Enter prompt
    const input = page.locator('textarea[placeholder*="Ask the swarm"]');
    await input.fill('Design a high-frequency trading system for Cerebras');
    await page.keyboard.press('Enter');

    // 2. Validation: SpeedHUD activates
    const hud = page.locator('.speed-hud-value');
    await expect(hud).toBeVisible();
    
    // 3. Validation: SwarmVisualizer shows active nodes
    // We expect at least 3 nodes (Planner, Research, Synth) to appear
    const nodes = page.locator('.agent-node');
    await expect(async () => {
      const count = await nodes.count();
      expect(count).toBeGreaterThanOrEqual(3);
    }).toPass({ timeout: 15000 });

    // 4. Validation: SSE streaming content appears in the console
    const consoleLog = page.locator('.swarm-console-output');
    await expect(consoleLog).toContainText('Planning phase complete');
    await expect(consoleLog).toContainText('Synthesizing final artifact');

    // 5. Final State: Artifact is rendered in the Glass-OS panel
    const artifactPanel = page.locator('.final-artifact-container');
    await expect(artifactPanel).toBeVisible();
    await expect(artifactPanel).not.toBeEmpty();
    
    // 6. Performance Check: Ensure no UI freeze during high-velocity stream
    // Check if the "Nexus" sidebar is still responsive
    await page.click('.nexus-sidebar-toggle');
    await expect(page.locator('.nexus-sidebar')).toBeVisible();
  });

  test('should handle API errors gracefully in the UI', async ({ page }) => {
    // Force a 500 error via a specific "trigger-error" prompt
    await page.goto('/');
    await page.fill('textarea', 'TRIGGER_SYSTEM_FAILURE');
    await page.keyboard.press('Enter');

    const errorToast = page.locator('.toast-error');
    await expect(errorToast).toBeVisible();
    await expect(errorToast).toContainText('Swarm execution failed');
    
    // Ensure the UI doesn't crash and allows a retry
    const retryBtn = page.locator('button:has-text("Retry Run")');
    await expect(retryBtn).toBeVisible();
  });
});
