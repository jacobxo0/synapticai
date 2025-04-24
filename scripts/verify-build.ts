import fs from 'fs';
import path from 'path';
import http from 'http';

const REQUIRED_ENV_VARS = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL',
  'GITHUB_ID',
  'GITHUB_SECRET'
];

async function checkBuildOutput() {
  console.log('🔍 Checking build output...');
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    throw new Error('❌ .next directory not found! Build may have failed.');
  }
  console.log('✅ .next directory exists');
}

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  const missingVars = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    throw new Error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  }
  console.log('✅ All required environment variables are present');
}

function checkApiEndpoint(endpoint: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000${endpoint}`;
    console.log(`🔍 Checking API endpoint: ${url}`);
    
    const req = http.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${endpoint} responded with 200`);
        resolve();
      } else {
        reject(new Error(`❌ ${endpoint} responded with status ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(new Error(`❌ Failed to connect to ${endpoint}: ${error.message}`));
    });

    req.end();
  });
}

async function main() {
  try {
    // Check build output
    await checkBuildOutput();

    // Check environment variables
    checkEnvironmentVariables();

    // Check API endpoints
    await checkApiEndpoint('/api/messages');
    
    console.log('✅ All verification checks passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n🚨 Verification failed:', error.message);
    process.exit(1);
  }
}

main(); 