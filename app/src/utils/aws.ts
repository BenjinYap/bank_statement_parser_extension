import type { Credentials } from '../models/Credentials';
import { loadCredentials } from './credentials';

export const AWS_REGION = 'us-east-2';

type AwsClientCredentials = { accessKeyId:string; secretAccessKey:string };

// Loads the saved AWS credentials in the format that the AWS SDK clients use.
// Call this for each new client, so that the client always uses the most recently saved credentials.
export async function loadAwsCredentials():Promise<AwsClientCredentials> {
  const credentials:Credentials|undefined = await loadCredentials();
  if (credentials === undefined) {
    throw new Error('No AWS credentials are saved. Save them in the credentials window.');
  }

  return { accessKeyId: credentials.aws.accessKey, secretAccessKey: credentials.aws.secretKey };
}
