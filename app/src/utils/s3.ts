import { S3Client, GetObjectCommand, PutObjectCommand, type GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { AWS_REGION, loadAwsCredentials } from './aws';

const S3_BUCKET = 'bank-statement-parser-extension';

async function createClient():Promise<S3Client> {
  return new S3Client({ region: AWS_REGION, credentials: await loadAwsCredentials() });
}

export async function putObject(key:string, body:string) {
  const client:S3Client = await createClient();
  const command:PutObjectCommand = new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: body });
  await client.send(command);
}

export async function getObject(key:string):Promise<string> {
  const client:S3Client = await createClient();
  const command:GetObjectCommand = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
  const response:GetObjectCommandOutput = await client.send(command);
  if (response.Body === undefined) {
    throw new Error(`The S3 object "${key}" has no body.`);
  }

  return response.Body.transformToString();
}
