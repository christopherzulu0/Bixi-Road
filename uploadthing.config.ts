// Global UploadThing configuration
// Increases server-side network timeout for metadata registration and related requests
// Default is ~10s; we bump to 30s to better tolerate slow networks/regions

import type { UploadThingConfig } from "uploadthing/server";

export const config: UploadThingConfig = {
  uploadTimeout: 30000, // 30 seconds
};
