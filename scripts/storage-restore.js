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

async function restoreStorage(date?: string) {
  try {
    console.log('Starting Supabase storage restore...');

    // Use provided date or latest backup
    const backupDate = date || await getLatestBackupDate();
    console.log(`Restoring from backup date: ${backupDate}`);

    // List all buckets in backup
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) throw bucketsError;

    for (const bucket of buckets) {
      console.log(`Restoring bucket: ${bucket.name}`);

      // Clear existing files
      const { error: clearError } = await supabase
        .storage
        .from(bucket.name)
        .remove(['*']);

      if (clearError) throw clearError;

      // List files in backup
      const { data: files, error: filesError } = await supabase
        .storage
        .from(`${bucket.name}-backup`)
        .list();

      if (filesError) throw filesError;

      // Restore each file
      for (const file of files) {
        console.log(`Restoring: ${file.name}`);
        
        // Copy from backup to main bucket
        const { error: copyError } = await supabase
          .storage
          .from(bucket.name)
          .copy(`${bucket.name}-backup/${file.name}`, file.name);

        if (copyError) throw copyError;

        // Verify file
        const { data: verifyData, error: verifyError } = await supabase
          .storage
          .from(bucket.name)
          .download(file.name);

        if (verifyError) throw verifyError;

        if (!verifyData) {
          throw new Error(`File ${file.name} restore failed`);
        }
      }
    }

    console.log('Storage restore completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Storage restore failed:', error);
    process.exit(1);
  }
}

async function getLatestBackupDate(): Promise<string> {
  const { data: backups, error } = await supabase
    .storage
    .from('synapticai-v2-files-backup')
    .list();

  if (error) throw error;

  // Sort by date and get latest
  const latest = backups
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

  return latest.created_at.split('T')[0];
}

// Parse command line arguments
const args = process.argv.slice(2);
const dateArg = args.find(arg => arg.startsWith('--date='));
const date = dateArg ? dateArg.split('=')[1] : undefined;

restoreStorage(date); 