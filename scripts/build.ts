import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function logError(message: string, suggestion?: string) {
  console.error(chalk.red(`\n❌ ${message}`));
  if (suggestion) {
    console.log(chalk.yellow(`\n💡 Suggestion: ${suggestion}\n`));
  }
}

function logSuccess(message: string) {
  console.log(chalk.green(`\n✅ ${message}`));
}

function checkPrismaSchema(): boolean {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  return fs.existsSync(schemaPath);
}

function checkPackageJson(): { exists: boolean; content?: PackageJson } {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    return { exists: false };
  }
  return {
    exists: true,
    content: JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  };
}

function executeCommand(command: string, errorMessage: string): boolean {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    logError(errorMessage, (error as Error).message);
    return false;
  }
}

async function build() {
  console.log(chalk.blue('\n🚀 Starting build process...\n'));

  // Check if package.json exists
  const { exists: packageExists, content: packageJson } = checkPackageJson();
  if (!packageExists) {
    logError(
      'package.json not found!',
      'Run "npm init" to create a new package.json file'
    );
    process.exit(1);
  }

  // Install dependencies
  console.log(chalk.blue('📦 Installing dependencies...\n'));
  if (!executeCommand('npm install', 'Failed to install dependencies')) {
    logError(
      'Dependency installation failed',
      'Try running "npm install" manually and check for error messages.\n' +
      'Make sure you have a stable internet connection and valid npm registry access.'
    );
    process.exit(1);
  }
  logSuccess('Dependencies installed successfully');

  // Check and run Prisma generate
  const hasPrismaSchema = checkPrismaSchema();
  if (hasPrismaSchema) {
    console.log(chalk.blue('\n🔄 Generating Prisma client...\n'));
    if (!executeCommand('npx prisma generate', 'Failed to generate Prisma client')) {
      logError(
        'Prisma client generation failed',
        'Check your schema.prisma file for errors.\n' +
        'Make sure your database connection URL is correct in .env'
      );
      process.exit(1);
    }
    logSuccess('Prisma client generated successfully');
  } else {
    console.log(chalk.yellow('\n⚠️ No Prisma schema found - skipping Prisma generation\n'));
  }

  // Run Next.js build
  console.log(chalk.blue('\n🏗️ Building Next.js application...\n'));
  if (!executeCommand('next build', 'Failed to build Next.js application')) {
    logError(
      'Next.js build failed',
      'Check the build errors above.\n' +
      'Common issues:\n' +
      '- TypeScript errors\n' +
      '- Missing environment variables\n' +
      '- Invalid component syntax\n' +
      'Try running "next build" separately for more detailed error messages.'
    );
    process.exit(1);
  }
  logSuccess('Next.js build completed successfully');

  console.log(chalk.green('\n✨ Build process completed successfully!\n'));
}

// Run the build process
build().catch((error) => {
  logError('Unexpected error during build', error.message);
  process.exit(1);
}); 