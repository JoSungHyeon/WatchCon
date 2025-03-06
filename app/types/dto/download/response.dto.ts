export interface DownloadResponseDto {
  status_code: number;
  message: string;
  data: {
    list: {
      id: string;
      watchcon_version: string;
      os_type: string;
      download_link: string;
      created_at: string;
    }[];
    page: number;
    total: number;
    page_size: number;
  };
}
