export interface NoticeResponseDto {
  GET: {
    data: {
      list: {
        id: string;
        is_notice_pop: number;
        is_notice_mail: number;
        category_no: string;
        title: string;
        content: string;
        admin_id: string;
        created_at: string;
        updated_at: string | null;
        username: string;
      }[];
      total: number;
    };
  };

  DETAIL: {
    status_code: number;
    message: string;
    data: {
      id: string;
      is_notice_pop: number;
      is_notice_mail: number;
      category_no: string;
      title: string;
      content: string;
      admin_id: string;
      created_at: string;
      updated_at: string;
    };
  };
}
