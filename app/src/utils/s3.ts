import { S3Client, GetObjectCommand, PutObjectCommand, type GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { AWS_REGION, loadAwsCredentials } from './aws';

const S3_BUCKET = 'bank-statement-parser-extension';

async function createClient():Promise<S3Client> {
  return new S3Client({ region: AWS_REGION, credentials: await loadAwsCredentials() });
}

export async function putObject(key:string, body:string) {
  const client:S3Client = await createClient();
  // S3 stores this header with the object, so that the browser checks with S3 before it uses a cached copy.
  const command:PutObjectCommand = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: body,
    CacheControl: 'no-cache',
  });
  await client.send(command);
}

export async function getObject(key:string):Promise<string> {
  const client:S3Client = await createClient();
  // The SDK sends the same URL on each read, so without this the browser can return an old cached response.
  // This value also goes into the URL, so the browser does not use cache entries from before this change.
  const command:GetObjectCommand = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ResponseCacheControl: 'no-cache',
  });
  const response:GetObjectCommandOutput = await client.send(command);
  if (response.Body === undefined) {
    throw new Error(`The S3 object "${key}" has no body.`);
  }

  return response.Body.transformToString();
}
