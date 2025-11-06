// Storage service abstraction for image uploads
// Supports Uploadthing (primary) and AWS S3 (fallback)

export interface StorageService {
  uploadImage(file: File | Blob, filename?: string): Promise<string>;
  uploadImages(files: (File | Blob)[], baseFilename?: string): Promise<string[]>;
  deleteImage(url: string): Promise<void>;
}

// Uploadthing implementation
class UploadthingStorage implements StorageService {
  async uploadImage(file: File | Blob, filename?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    if (filename) {
      formData.append('filename', filename);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  }

  async uploadImages(files: (File | Blob)[], baseFilename?: string): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const filename = baseFilename
        ? `${baseFilename}-${index + 1}`
        : undefined;
      return this.uploadImage(file, filename);
    });

    return Promise.all(uploadPromises);
  }

  async deleteImage(url: string): Promise<void> {
    // Uploadthing handles deletion automatically or via API
    // For now, we'll just log it
    console.log('Delete image:', url);
  }
}

// AWS S3 implementation (for future use)
class S3Storage implements StorageService {
  async uploadImage(file: File | Blob, filename?: string): Promise<string> {
    // TODO: Implement S3 upload
    throw new Error('S3 storage not implemented yet');
  }

  async uploadImages(files: (File | Blob)[], baseFilename?: string): Promise<string[]> {
    // TODO: Implement S3 batch upload
    throw new Error('S3 storage not implemented yet');
  }

  async deleteImage(url: string): Promise<void> {
    // TODO: Implement S3 delete
    throw new Error('S3 storage not implemented yet');
  }
}

// Factory function to get storage service
export function getStorageService(): StorageService {
  const storageType = process.env.STORAGE_TYPE || 'uploadthing';

  switch (storageType) {
    case 's3':
      return new S3Storage();
    case 'uploadthing':
    default:
      return new UploadthingStorage();
  }
}

export const storageService = getStorageService();

