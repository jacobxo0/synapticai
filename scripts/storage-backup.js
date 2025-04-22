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

async function backupStorage() {
  try {
    console.log('Starting Supabase storage backup...');

    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) throw bucketsError;

    for (const bucket of buckets) {
      console.log(`Backing up bucket: ${bucket.name}`);

      // Create backup directory
      const backupDir = path.join(process.env.BACKUP_DIR!, 'storage', bucket.name);
      await fs.promises.mkdir(backupDir, { recursive: true });

      // List all files in bucket
      const { data: files, error: filesError } = await supabase
        .storage
        .from(bucket.name)
        .list();

      if (filesError) throw filesError;

      // Download each file
      for (const file of files) {
        console.log(`Downloading: ${file.name}`);
        
        const { data, error: downloadError } = await supabase
          .storage
          .from(bucket.name)
          .download(file.name);

        if (downloadError) throw downloadError;

        // Save file
        const filePath = path.join(backupDir, file.name);
        await fs.promises.writeFile(filePath, await data.arrayBuffer());

        // Verify file
        const stats = await fs.promises.stat(filePath);
        if (stats.size === 0) {
          throw new Error(`File ${file.name} is empty`);
        }
      }
    }

    console.log('Storage backup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Storage backup failed:', error);
    process.exit(1);
  }
}

backupStorage(); 