import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase'; // Assuming storage is exported from firebase.ts
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names

export interface UploadedImageInfo {
  url: string;
  path: string;
}

/**
 * Uploads multiple image files to Firebase Storage.
 *
 * @param files - An array of File objects to upload.
 * @param basePath - The base path in Firebase Storage where files should be stored (e.g., 'venue-images').
 * @param onProgress - Optional callback to report upload progress for each file.
 *                     Receives (fileName, progress_percentage).
 * @returns A promise that resolves to an array of UploadedImageInfo objects (URL and storage path).
 */
export const uploadImages = async (
  files: File[],
  basePath: string,
  onProgress?: (fileName: string, progress: number) => void
): Promise<UploadedImageInfo[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises: Promise<UploadedImageInfo>[] = files.map(file => {
    return new Promise((resolve, reject) => {
      // Create a unique file name using UUID to prevent overwrites
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      const storageRef = ref(storage, `${basePath}/${uniqueFileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(file.name, progress);
          }
        },
        (error) => {
          console.error(`Error uploading ${file.name}:`, error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url: downloadURL, path: storageRef.fullPath });
          } catch (error) {
            console.error(`Error getting download URL for ${file.name}:`, error);
            reject(error);
          }
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error uploading one or more images:", error);
    // Depending on requirements, you might want to handle partial successes
    // or ensure all-or-nothing. This example throws if any upload fails.
    throw new Error("Failed to upload one or more images.");
  }
};

// Example of how to delete an image if needed (optional, can be added later)
/*
import { deleteObject } from 'firebase/storage'; // Import deleteObject

export const deleteImageByPath = async (filePath: string): Promise<void> => {
  const imageRef = ref(storage, filePath);
  try {
    await deleteObject(imageRef);
  } catch (error) {
    console.error(`Error deleting image at ${filePath}:`, error);
    throw error;
  }
};
*/
