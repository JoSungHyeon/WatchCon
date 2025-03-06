export interface NoticeRequestDto {
  LIST: {
    POST: {
      is_notice_pop: number;
      is_notice_mail: number;
      title: string;
      content: string;
      category_no: number;
    };
    UPDATE: {
      id: string;
      is_notice_pop: number;
      is_notice_mail: number;
      title: string;
      content: string;
    };
  };
}
