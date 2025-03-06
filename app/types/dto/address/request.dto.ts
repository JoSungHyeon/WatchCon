export interface AddressRequestDto {
  GET: {
    id: string;
    page: number;
    page_size: number;
  };

  LIST: {
    page_no: number;
    page_size: number;
    search_term?: string;
  };

  CREATE: {
    alias: string;
    hostname: string;
    id: string;
    platform: string;
    tags: string[];
    username: string;
  };

  UPDATE: {
    alias: string;
    hostname: string;
    id: string;
    platform: string;
    tags: string[];
    username: string;
    row_id: string;
  };

  DELETE: {
    id: string;
  };
}
