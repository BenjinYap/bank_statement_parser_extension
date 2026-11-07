import { TextractClient, AnalyzeExpenseCommand, type AnalyzeExpenseCommandOutput } from '@aws-sdk/client-textract';
import { AWS_REGION, loadAwsCredentials } from './aws';

// Sends a receipt image to Textract AnalyzeExpense. Textract accepts at most 5 MB of image bytes.
// Make a new client for each call, so that the client always uses the most recently saved credentials.
export async function analyzeExpense(image:Blob):Promise<AnalyzeExpenseCommandOutput> {
  const client:TextractClient = new TextractClient({ region: AWS_REGION, credentials: await loadAwsCredentials() });
  const bytes:Uint8Array = new Uint8Array(await image.arrayBuffer());
  const command:AnalyzeExpenseCommand = new AnalyzeExpenseCommand({ Document: { Bytes: bytes } });
  return client.send(command);
}
