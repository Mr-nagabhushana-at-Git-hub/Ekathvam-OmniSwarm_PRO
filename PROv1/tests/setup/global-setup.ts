// tests/setup/global-setup.ts
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

export default async function globalSetup() {
  console.log('🚀 Initializing OmniSwarm PROv1 Test Environment...');
  
  try {
    // 1. Spin up ephemeral test DB via Docker Compose
    execSync('docker compose -f docker-compose.test.yml up -d --wait', { stdio: 'inherit' });
    
    // 2. Run Database Migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    // 3. Seed basic system config (Model Registry, etc.)
    execSync('npx ts-node tests/setup/seed.ts', { stdio: 'inherit' });
    
    console.log('✅ Environment Ready.');
  } catch (error) {
    console.error('❌ Global Setup Failed:', error);
    process.exit(1);
  }
}
