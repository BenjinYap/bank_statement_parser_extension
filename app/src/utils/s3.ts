import { S3Client, GetObjectCommand, PutObjectCommand, type GetObjectCommandOutput } from '@aws-sdk/client-s3';
import type { Credentials } from '../models/Credentials';
import { loadCredentials } from './credentials';

const S3_BUCKET = 'bank-statement-parser-extension';
const S3_REGION = 'us-east-2';

// Make a new client for each call, so that the client always uses the most recently saved credentials.
async function createClient():Promise<S3Client> {
  const credentials:Credentials|undefined = await loadCredentials();
  if (credentials === undefined) {
    throw new Error('No AWS credentials are saved. Save them in the credentials window.');
  }

  return new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: credentials.aws.accessKey,
      secretAccessKey: credentials.aws.secretKey,
    },
  });
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
