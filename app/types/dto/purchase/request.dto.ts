export interface PurchaseRequestDto {
  GET: {
    data: [];
  };

  UPDATE: {
    id: string;
  };

  POST: {
    buyerName: string;
    buyerEmail: string;
    buyerTel: string;
    encMode: null;
    encData: string;
    license_type: number;
    purchase_type: number;
    purchase_mode: number;
    price_features_list_id: number;
  };
}
