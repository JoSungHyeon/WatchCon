export interface PurchaseItem {
  LIST: {
    GET: {
      status_code: number;
      message: string;
      data: [
        {
          id: string;
          is_repurchase: string;
          user_id: string;
          purchase_date: string;
          number_of_purchases: number;
          purchase_pay: number;
          license_type: string;
          license_no: string;
          price_id: string;
          discount_list_id: string;
          is_purchase_kw: string;
          purchase_subscribe_type: number;
          is_purchase_cancel: number;
          orderid_id: string;
          orderid_result: string;
          price_features_list_id: string;
          tid: null;
          created_at: string;
          updated_at: string;
        },
      ];
    };
  };
}

export interface PurchaseResponseDto {
  GET: {
    status_code: number;
    message: string;
    data: {
      list: {
        id: string;
        is_repurchase: string;
        user_id: string;
        purchase_date: string;
        number_of_purchases: number;
        purchase_pay: number;
        license_type: string;
        license_no: string;
        price_id: string;
        discount_list_id: string;
        is_purchase_kw: string;
        purchase_subscribe_type: number;
        is_purchase_cancel: number;
        orderid_id: string;
        orderid_result: string;
        price_features_list_id: string;
        tid: null;
        created_at: string;
        updated_at: null;
      };
      page: number;
      total: number;
      page_size: number;
    };
  };
}
