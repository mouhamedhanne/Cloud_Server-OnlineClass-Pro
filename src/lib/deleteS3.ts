import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function deleteImageFromS3(key: string) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_LESSON_CONTENT_IMAGES_BUCKET_NAME!,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    return false;
  }
}
