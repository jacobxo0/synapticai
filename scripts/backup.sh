#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directories
mkdir -p $BACKUP_DIR/database
mkdir -p $BACKUP_DIR/storage

# Database Backup
echo "Starting database backup..."
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/database/backup_$TIMESTAMP.sql.gz

# Verify database backup
if [ -s $BACKUP_DIR/database/backup_$TIMESTAMP.sql.gz ]; then
  echo "Database backup successful"
else
  echo "Database backup failed"
  exit 1
fi

# File Storage Backup
echo "Starting file storage backup..."
node scripts/storage-backup.js

# Verify storage backup
if [ $? -eq 0 ]; then
  echo "Storage backup successful"
else
  echo "Storage backup failed"
  exit 1
fi

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR/database -name "backup_*.sql.gz" -mtime +7 -delete

# Upload to S3
echo "Uploading backups to S3..."
aws s3 sync $BACKUP_DIR/database s3://mindmate-backups/database/
aws s3 sync $BACKUP_DIR/storage s3://mindmate-backups/storage/

# Verify S3 upload
if [ $? -eq 0 ]; then
  echo "S3 upload successful"
else
  echo "S3 upload failed"
  exit 1
fi

echo "Backup completed successfully" 