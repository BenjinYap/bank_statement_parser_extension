// Textract accepts at most 5 MB, so the phone page shrinks each photo before upload.
const MAX_SIDE = 2500;
const JPEG_QUALITY = 0.85;

// Scales the photo down until its long side is at most MAX_SIDE pixels, and converts it to JPEG.
export async function shrinkPhoto(photo:File):Promise<Blob> {
  const canvas:HTMLCanvasElement = document.createElement('canvas');
  const context:CanvasRenderingContext2D|null = canvas.getContext('2d');
  if (context === null) {
    throw new Error('The browser cannot draw on a canvas.');
  }

  const bitmap:ImageBitmap = await createImageBitmap(photo);
  try {
    const scale:number = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  } finally {
    bitmap.close();
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob:Blob|null) => {
      if (blob === null) {
        reject(new Error('The photo could not be converted to JPEG.'));
        return;
      }

      resolve(blob);
    }, 'image/jpeg', JPEG_QUALITY);
  });
}
