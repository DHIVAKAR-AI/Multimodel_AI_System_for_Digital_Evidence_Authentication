// Global In-Memory File & Blob Cache for Veridex Evidence Assets
// Preserves real File objects and object URLs across Ingestion, Workspace, and Case Folders

const blobCache = new Map();

export const fileCache = {
  set(fileName, fileObj, previewUrl) {
    if (!fileName) return;
    let url = previewUrl;
    if (!url && fileObj) {
      try {
        url = URL.createObjectURL(fileObj);
      } catch (e) {
        console.warn('Failed to create object URL:', e);
      }
    }
    blobCache.set(fileName.toLowerCase(), { fileObj, previewUrl: url });
  },

  get(fileName) {
    if (!fileName) return null;
    return blobCache.get(fileName.toLowerCase()) || null;
  },

  resolve(file) {
    if (!file) return file;
    const cached = this.get(file.name);
    return {
      ...file,
      fileObj: file.fileObj || cached?.fileObj || null,
      previewUrl: file.previewUrl || cached?.previewUrl || null
    };
  },

  has(fileName) {
    return blobCache.has(fileName.toLowerCase());
  }
};
