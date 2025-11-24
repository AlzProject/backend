/**
 * S3/MinIO client configuration
 *
 * Initializes AWS SDK S3 client for MinIO-compatible storage
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import config from "../config/config.js";

/**
 * Initialize S3 client for MinIO
 */
export const s3Client = new S3Client({
  region: "us-east-1", // MinIO default region
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
  forcePathStyle: true, // Required for MinIO
});

/**
 * S3 commands for common operations
 */
export {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
};

/**
 * Get S3 bucket name
 */
export function getBucketName(): string {
  return config.s3.bucket;
}

/**
 * Generate S3 object key for media
 */
export function generateMediaKey(filename: string, mediaId: number): string {
  const timestamp = Date.now();
  const extension = filename.split(".").pop() || "bin";
  return `media/${mediaId}/${timestamp}.${extension}`;
}

/**
 * Generate public URL for S3 object
 */
export function generateMediaUrl(objectKey: string): string {
  return `${config.s3.endpoint}/${config.s3.bucket}/${objectKey}`;
}
