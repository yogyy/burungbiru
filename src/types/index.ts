interface FileUploadInfo {
  event: string;
  info: {
    access_mode: string;
    asset_id: string;
    batchId: string;
    bytes: number;
    created_at: string;
    etag: string;
    folder: string;
    format: string;
    height: number;
    id: string;
    original_filename: string;
    path: string;
    placeholder: boolean;
    public_id: string;
    resource_type: string;
    secure_url: string;
    signature: string;
    tags: string[];
    thumbnail_url: string;
    type: string;
    url: string;
    version: number;
    version_id: string;
    width: number;
  };
}

export type { FileUploadInfo };
