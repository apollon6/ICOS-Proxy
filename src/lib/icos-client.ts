import { S3 } from "ibm-cos-sdk";

const ICOS_CONFIG = {
  endpoint: process.env.ICOS_ENDPOINT,
  apiKeyId: process.env.ICOS_API_KEY,
  serviceInstanceId: process.env.ICOS_INSTANCE_ID,
};
const cos = new S3(ICOS_CONFIG);

/**
 * ICOSからオブジェクトを取得
 * @param bucket バケット名
 * @param key オブジェクトキー（ファイル名）
 */
export async function getObject(key: string): Promise<S3.GetObjectOutput> {
  const bucket = process.env.ICOS_BUCKET_NAME;
  if (!bucket) {
    throw new Error("Missing environment variable: ICOS_BUCKET_NAME");
  }
  try {
    const result = await cos.getObject({ Bucket: bucket, Key: key }).promise();
    return result;
  } catch (err) {
    throw new Error(`Object fetch failed: ${key}`);
  }
}
