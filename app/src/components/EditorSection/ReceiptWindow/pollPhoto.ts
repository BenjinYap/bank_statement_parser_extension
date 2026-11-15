export type PollResult = {
  // The new photo. It is undefined if no new photo is waiting or if the request failed.
  photo:Blob|undefined;
  // The error message. It is undefined if the request succeeded.
  error:string|undefined;
};

// Asks the uploader one time for a new photo.
export async function pollPhoto(url:string):Promise<PollResult> {
  try {
    const response:Response = await fetch(url, { cache: 'no-store' });

    // A 204 status means that no new photo is waiting.
    if (response.status === 204) {
      return { photo: undefined, error: undefined };
    }

    if (response.status !== 200) {
      return { photo: undefined, error: `The uploader returned an unexpected ${response.status}.` };
    }

    const photo:Blob = await response.blob();
    return { photo, error: undefined };
  } catch {
    return { photo: undefined, error: 'The uploader is not running.' };
  }
}
