export interface AdminFaqResponseDto {
  //FAQ List
  GET: {
    list: {
      id: string;
      subject: string;
      is_notice: string;
      category_id: string;
      content: string;
      admin_id: string;
      created_at: string;
      updated_at: string;
      category_name: string;
    }[];
    page: number;
    total: number;
    page_size: number;
  };

  DETAIL: {
    status_code: number;
    message: string;
    data: {
      id: string;
      is_notice: number;
      category_id: string;
      subject: string;
      content: string;
      admin_id: string;
      created_at: string;
      updated_at: string;
    };
  };

  //New FAQ
  CATEGORY: {
    GET: {
      data: {
        list: {
          id: string;
          category_no: number;
          category_sub_no: number;
          category_name: string;
          admin_id: string;
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
