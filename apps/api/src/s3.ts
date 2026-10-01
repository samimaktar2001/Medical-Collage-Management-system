import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Config = {
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false', // true by default, required for Supabase/MinIO
};

export const s3Client = new S3Client(s3Config);
export const bucket = process.env.S3_BUCKET || 'medora-documents';

export async function uploadToS3(key: string, buffer: Buffer, mimeType: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });
  await s3Client.send(command);
  return key;
}

export async function getPresignedDownloadUrl(key: string, fileName?: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: fileName ? `attachment; filename="${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}"` : undefined,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
