interface GraphDataPoint {
  count: string;
}

interface MonthDataPoint extends GraphDataPoint {
  x_axis_day: string;
}

interface WeekDataPoint extends GraphDataPoint {
  day: string;
}

interface GraphData<T extends GraphDataPoint> {
  status_code: number;
  message: string;
  data: {
    list1: T[];
    list2: T[];
  };
}

export interface EcommerceResponseDto {
  TOTAL_CONNECTION: {
    status_code: number;
    message: string;
    data: {
      total: string;
      rate: number;
    };
  };

  TOTAL_SALES: {
    status_code: number;
    message: string;
    data: {
      total: string;
      rate: number;
    };
  };

  TOTAL_DOWNLOAD: {
    status_code: number;
    message: string;
    data: {
      total: string;
      rate: number;
    };
  };

  TOTAL_USER: {
    status_code: number;
    message: string;
    data: {
      total: string;
      rate: number;
    };
  };

  GRAPH_CONNECTION: {
    MONTH: GraphData<MonthDataPoint>;
    WEEK: GraphData<WeekDataPoint>;
  };

  GRAPH_DOWNLOAD: {
    MONTH: GraphData<MonthDataPoint>;
    WEEK: GraphData<WeekDataPoint>;
  };

  LIST_USER: {
    status_code: number;
    message: string;
    data: {
      list1: {
        watchcon_id: string;
        login_status: string;
        max_connection_count: string;
        install_time: string;
        using_day: string;
        Last_time: string;
      };
    };
  };
}
