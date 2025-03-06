export interface UserResponseDto {
  USER_LIST: {
    status_code: number;
    message: string;
    data: {
      list: {
        username: string;
        license_type: string;
        published_time: string;
        license_expired_time: string;
        connection_count: string;
        updated_at: string;
      }[];
      page: number;
      total: number;
      page_size: number;
    };
  };

  MAILING_LIST: {
    status_code: number;
    message: string;
    data: {
      list: {
        id: string;
        admin_id: string;
        receiver_list: string;
        title: string;
        content: string;
        attached_file: string | null;
        from_where: string | null;
        reservation_send: string | null;
        reservation_send_time: string | null;
        created_at: string;
        updated_at: string | null;
      }[];
      page: number;
      total: number;
      page_size: number;
    };

    RESULT: {
      status_code: number;
      message: string;
      data: {
        list: {
          id: string;
          user_id: string;
          mail_id: string;
          from_where: string;
          result: string;
          created_at: string;
          updated_at: string | null;
        }[];
      };
      page: number;
      total: number;
      page_size: number;
    };

    RESULT_DETAIL: {
      status_code: number;
      message: string;
      data: {
        id: string;
        admin_id: string;
        receiver_list: string;
        title: string;
        content: string;
        attached_file: string | null;
        from_where: string | null;
        reservation_send: string | null;
        reservation_send_time: string | null;
        created_at: string;
        updated_at: string | null;
      };
    };
  };
}
