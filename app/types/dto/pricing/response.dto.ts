export interface PricingResponseDto {
  GET: {
    data: {
      list: {
        id: string;
        basic_kw: number;
        premium_kw: number;
        business_kw: number;
        basic_usd: number;
        premium_usd: number;
        business_usd: number;
        admin_id: string;
        notice_at: string;
        apply_at: string;
        expired_at: string;
        created_at: string;
        updated_at: string | null;
      }[];
      page: number;
      total: number;
      page_size: number;
    };
  };

  DETAIL: {
    status_code: number;
    message: string;
    data: {
      id: string;
      basic_kw: number;
      premium_kw: number;
      business_kw: number;
      basic_usd: number;
      premium_usd: number;
      business_usd: number;
      admin_id: string;
      notice_at: string;
      apply_at: string;
      expired_at: string;
      created_at: string;
      updated_at: string | null;
    };
  };

  DISCOUNT_LIST: {
    GET: {
      data: {
        list: {
          id: string;
          before_week: number;
          repurchase_discount_rate: number;
          basic: number;
          premium: number;
          business: number;
          admin_id: string;
          notice_at: string;
          apply_at: string;
          expired_at: string;
          created_at: string;
          updated_at: string | null;
        }[];
        page: number;
        total: number;
        page_size: number;
      };
    };
  };

  FEATURE_LIMIT: {
    GET: {
      status_code: number;
      message: string;
      data: {
        list: {
          price_model: number;
          feature1: number;
          feature2: number;
          feature3: number;
          feature4: number;
          feature5: string;
          feature6: string;
          feature7: number;
          feature8: number;
          feature9: string;
          feature10: string;
          feature11: string;
          feature12: number;
          feature13: number;
          feature14: number;
          feature15: number;
          feature16: number;
          feature17: number;
          feature18: number;
          feature19: number;
          feature20: number;
          admin_id: string;
          notice_at: string;
          apply_at: string;
          expired_at: string;
          created_at: string;
          updated_at: string | null;
        }[];
        page: number;
        total: number;
        page_size: number;
      };
    };
  };
}
