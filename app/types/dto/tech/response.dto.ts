export interface TechResponseDto {
  LIST: {
    GET: {
      status_code: number;
      message: string;
      data: {
        list: {
          id: string;
          title: string;
          content: string;
          file_yn: string;
          file_name: string;
          reply_yn: string;
          request_type: number;
          request_name: string;
          request_email: string;
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
