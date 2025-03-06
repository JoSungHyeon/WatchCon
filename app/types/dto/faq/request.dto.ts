export interface AdminFaqRequestDto {
  GET: {
    startDate: string;
    endDate: string;
    page_no: number;
    page_size: number;
  };

  CREATE: {
    subject: string;
    is_notice: number;
    category_id: number;
    content: string;
  };

  UPDATE: {
    id: number;
    subject: string;
    is_notice: number;
    category_id: number;
    content: string;
  };

  CREATE_CATEGORY: {
    category_name: string;
    category_no: number;
    admin_id: number;
    category_sub_no: number;
  };

  UPDATE_CATEGORY: {
    id: number;
    category_no: number;
    category_sub_no: number;
    category_name: string;
  };
}
