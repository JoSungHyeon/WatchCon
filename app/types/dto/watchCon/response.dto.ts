export interface WatchConResponseDto {
  TOTAL_LIST: {
    status_code: number;
    message: string;
    data: {
      list: {
        login_status: string;
        watchcon_id: string;
        max_connection_count: string;
        install_time: string;
        using_day: string;
      }[];
      page: number;
      total: number;
      page_size: number;
    };
  };

  BLACK_LIST: {
    status_code: number;
    message: string;
    data: {
      list: {
        watchcon_id: string;
        max_connection_count: string;
        install_time: string;
        using_days: string;
      }[];
      page: number;
      total: number;
      page_size: number;
    };
  };

  DISABLED_LIST: {
    status_code: number;
    message: string;
    data: {
      list: {
        watchcon_id: string;
        max_connection_count: string;
        install_time: string;
        using_days: string;
        disable_time: string;
      }[];
      page: number;
      total: number;
      page_size: number;
    };
  };
}

