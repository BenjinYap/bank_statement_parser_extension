import {
  TextractClient,
  AnalyzeExpenseCommand,
  type AnalyzeExpenseCommandOutput,
  type ExpenseField, type BoundingBox
} from '@aws-sdk/client-textract';
import { AWS_REGION, loadAwsCredentials } from './aws';

export type LineItemResult = {
  item: {
    text: string,
    boundingBox: BoundingBox,
  },
  price: {
    text: string,
    boundingBox: BoundingBox,
  }
};

// Sends a receipt image to Textract AnalyzeExpense. Textract accepts at most 5 MB of image bytes.
export async function analyzeExpense(image:Blob):Promise<LineItemResult[]> {
  const client:TextractClient = new TextractClient({ region: AWS_REGION, credentials: await loadAwsCredentials() });
  const bytes:Uint8Array = new Uint8Array(await image.arrayBuffer());
  const command:AnalyzeExpenseCommand = new AnalyzeExpenseCommand({ Document: { Bytes: bytes } });
  const response:AnalyzeExpenseCommandOutput = await client.send(command);

  const results:LineItemResult[] = [];
  response.ExpenseDocuments?.[0]?.LineItemGroups?.[0]?.LineItems?.forEach(lineItem => {
    const item:ExpenseField|undefined = lineItem.LineItemExpenseFields?.find(f => f.Type?.Text === 'ITEM');
    const price:ExpenseField|undefined = lineItem.LineItemExpenseFields?.find(f => f.Type?.Text === 'PRICE');

    if (!item || !price) {
      return;
    }

    results.push({
      item: {
        text: item.ValueDetection?.Text!,
        boundingBox: item.ValueDetection?.Geometry?.BoundingBox!,
      },
      price: {
        text: price.ValueDetection?.Text!,
        boundingBox: price.ValueDetection?.Geometry?.BoundingBox!,
      },
    });
  });
  return results;
}

