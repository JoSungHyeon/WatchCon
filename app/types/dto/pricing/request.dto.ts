export interface PricingRequestDto {
  PRICE_LIST: {
    POST: {
      basic_kw: number;
      premium_kw: number;
      business_kw: number;
      basic_usd: number;
      premium_usd: number;
      business_usd: number;
      notice_at: string;
      apply_at: string;
      expired_at: string;
    };
    PUT: PricingRequestDto['PRICE_LIST']['POST'] & {
      id: number;
    };
  };

  DISCOUNT_LIST: {
    POST: {
      before_week: number;
      repurchase_discount_rate: number;
      basic: number;
      premium: number;
      business: number;
      admin_id: number;
      notice_at: string;
      apply_at: string;
      expired_at: string;
    };
    PUT: PricingRequestDto['DISCOUNT_LIST']['POST'] & {
      id: number;
    };
  };

  FEATURE_LIST: {
    POST: {
      price_model: number;
      feature1: number;
      feature2: number;
      feature3: number;
      feature4: number;
      feature5: number;
      feature6: number;
      feature7: number;
      feature8: number;
      feature9: number;
      feature10: number;
      feature11: number;
      feature12: number;
      feature13: number;
      feature14: number;
      feature15: number;
      feature16?: number;
      feature17?: number;
      feature18?: number;
      feature19?: number;
      notice_at: string;
      apply_at: string;
      expired_at: string;
    };

    PUT: PricingRequestDto['FEATURE_LIST']['POST'] & {
      id: number;
    };
  };
}
