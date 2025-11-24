/**
 * Media service layer.
 *
 * Handles business logic for media operations:
 * - Uploading media files to S3
 * - Downloading/retrieving media
 * - Listing media
 * - Attaching media to questions and options
 * - Detaching media from questions and options
 */

import prisma from "../db/client.js";
import {
  s3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  generateMediaKey,
  generateMediaUrl,
  getBucketName,
} from "../db/s3.js";
import type { MEDIA_FILE } from "@prisma/client";

// Allow mocking S3 in tests
let mockS3Enabled = false;

export function enableMockS3() {
  mockS3Enabled = true;
}

export function disableMockS3() {
  mockS3Enabled = false;
}

/**
 * Upload media file to S3
 */
export async function uploadMedia(
  filename: string,
  fileBuffer: Buffer,
  fileType: MEDIA_FILE,
  label?: string
): Promise<any> {
  // Create media record
  const media = await prisma.media.create({
    data: {
      filename,
      label,
      type: fileType,
    },
  });

  try {
    // Generate S3 key
    const objectKey = generateMediaKey(filename, media.id);

    // Upload to S3 (skip if mocked)
    if (!mockS3Enabled) {
      const command = new PutObjectCommand({
        Bucket: getBucketName(),
        Key: objectKey,
        Body: fileBuffer,
        ContentType: getContentType(fileType),
      });

      await s3Client.send(command);
    }

    // Update media record with URL and version
    const updatedMedia = await prisma.media.update({
      where: { id: media.id },
      data: {
        url: generateMediaUrl(objectKey),
        version: objectKey,
      },
    });

    return updatedMedia;
  } catch (error) {
    // Delete media record if S3 upload fails
    await prisma.media.delete({
      where: { id: media.id },
    });
    throw error;
  }
}

/**
 * Delete media file from S3 and database
 */
export async function deleteMedia(mediaId: number): Promise<void> {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    throw new Error("Media not found");
  }

  // Delete from S3 if version (key) exists (skip if mocked)
  if (media.version && !mockS3Enabled) {
    const command = new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: media.version,
    });
    await s3Client.send(command);
  }

  // Delete from database
  await prisma.media.delete({
    where: { id: mediaId },
  });
}

/**
 * Get media by ID
 */
export async function getMediaById(mediaId: number): Promise<any> {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    throw new Error("Media not found");
  }

  return media;
}

/**
 * List media with pagination
 */
export async function listMedia(
  limit: number = 50,
  offset: number = 0
): Promise<{ items: any[]; total: number; limit: number; offset: number }> {
  const [items, total] = await Promise.all([
    prisma.media.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: "desc" },
    }),
    prisma.media.count(),
  ]);

  return { items, total, limit, offset };
}

/**
 * Attach media to question
 */
export async function attachToQuestion(
  questionId: number,
  mediaId: number
): Promise<void> {
  // Verify question exists
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  // Verify media exists
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    throw new Error("Media not found");
  }

  // Create link
  await prisma.questionMedia.create({
    data: {
      questionId,
      mediaId,
    },
  });
}

/**
 * Detach media from question
 */
export async function detachFromQuestion(
  questionId: number,
  mediaId: number
): Promise<void> {
  await prisma.questionMedia.delete({
    where: {
      questionId_mediaId: {
        questionId,
        mediaId,
      },
    },
  });
}

/**
 * Attach media to option
 */
export async function attachToOption(
  optionId: number,
  mediaId: number
): Promise<void> {
  // Verify option exists
  const option = await prisma.option.findUnique({
    where: { id: optionId },
  });

  if (!option) {
    throw new Error("Option not found");
  }

  // Verify media exists
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    throw new Error("Media not found");
  }

  // Create link
  await prisma.optionMedia.create({
    data: {
      optionId,
      mediaId,
    },
  });
}

/**
 * Detach media from option
 */
export async function detachFromOption(
  optionId: number,
  mediaId: number
): Promise<void> {
  await prisma.optionMedia.delete({
    where: {
      optionId_mediaId: {
        optionId,
        mediaId,
      },
    },
  });
}

/**
 * Get content type based on media file type
 */
function getContentType(fileType: MEDIA_FILE): string {
  const contentTypes: Record<MEDIA_FILE, string> = {
    image: "image/jpeg",
    video: "video/mp4",
    audio: "audio/mpeg",
    interactive: "application/json",
  };
  return contentTypes[fileType] || "application/octet-stream";
}

/**
 * Format media response
 */
export function formatMediaResponse(media: any): any {
  return {
    id: media.id,
    filename: media.filename,
    label: media.label,
    type: media.type,
    url: media.url,
    version: media.version,
  };
}
