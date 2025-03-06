export interface LicenseItem {
  LIST: {
    GET: {
      status_code: number;
      message: string;
      data: {
        list: [
          {
            id: string;
            username: string;
            useremail: string;
            user_license: [
              {
                license_type: string;
                auto_update: string;
                published_license: {
                  license_update_type: string;
                  license_no: string;
                  published_time: string;
                  license_expired_time: string;
                };
              },
            ];
          },
        ];
        page: number;
        total: number;
        page_size: number;
      };
    };
  };
}
