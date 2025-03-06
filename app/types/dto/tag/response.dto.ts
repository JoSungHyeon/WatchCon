export interface TagItem {
  LIST: {
    GET: {
      status_code: number;
      message: string;
      data: {
        list: {
          id: string;
          name: string;
          user_id: number;
          color: string;
          collection_id: number;
          created_at: string;
          updated_at: string;
        }[];
        page: number;
        total: number;
        page_size: number;
      };
    };
  };
}
