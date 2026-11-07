import { TextractClient, AnalyzeExpenseCommand, type AnalyzeExpenseCommandOutput } from '@aws-sdk/client-textract';
import { AWS_REGION, loadAwsCredentials } from './aws';

// Sends a receipt image to Textract AnalyzeExpense. Textract accepts at most 5 MB of image bytes.
export async function analyzeExpense(image:Blob):Promise<AnalyzeExpenseCommandOutput> {
  const client:TextractClient = new TextractClient({ region: AWS_REGION, credentials: await loadAwsCredentials() });
  const bytes:Uint8Array = new Uint8Array(await image.arrayBuffer());
  const command:AnalyzeExpenseCommand = new AnalyzeExpenseCommand({ Document: { Bytes: bytes } });
  return client.send(command);
}
