import { createClient } from '@supabase/supabase-js';
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function restoreDatabase(date?: string) {
  try {
    console.log('Starting Supabase database restore...');

    // Use provided date or latest backup
    const backupDate = date || await getLatestBackupDate();
    console.log(`Restoring from backup date: ${backupDate}`);

    // Get backup file
    const backupFile = await downloadBackup(backupDate);
    console.log('Backup file downloaded successfully');

    // Restore database
    await restoreFromFile(backupFile);
    console.log('Database restore completed successfully');

    // Cleanup
    fs.unlinkSync(backupFile);
    process.exit(0);
  } catch (error) {
    console.error('Database restore failed:', error);
    process.exit(1);
  }
}

async function getLatestBackupDate(): Promise<string> {
  const { data: backups, error } = await supabase
    .storage
    .from('synapticai-v2-db-backups')
    .list();

  if (error) throw error;

  // Sort by date and get latest
  const latest = backups
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

  return latest.created_at.split('T')[0];
}

async function downloadBackup(date: string): Promise<string> {
  const backupPath = `backups/${date}.sql`;
  
  const { data, error } = await supabase
    .storage
    .from('synapticai-v2-db-backups')
    .download(backupPath);

  if (error) throw error;

  const localPath = path.join(process.cwd(), `backup-${date}.sql`);
  fs.writeFileSync(localPath, Buffer.from(await data.arrayBuffer()));

  return localPath;
}

async function restoreFromFile(filePath: string) {
  const { data: { dbUrl }, error } = await supabase
    .rpc('get_database_url');

  if (error) throw error;

  // Restore using psql
  const restoreCmd = `psql "${dbUrl}" < "${filePath}"`;
  const { stderr } = await execAsync(restoreCmd);

  if (stderr) {
    console.warn('Restore warnings:', stderr);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dateArg = args.find(arg => arg.startsWith('--date='));
const date = dateArg ? dateArg.split('=')[1] : undefined;

restoreDatabase(date); 