export interface AuthResponseDto {
  FindId: {
    Success: {
      id: number;
      username: string;
      useremail: string;
      published_time: string;
      license_update_type: number;
      license_type: number;
      license_no: string;
      license_expired_time: string;
      is_enable_license_update: number;
    };
    Error: {
      401: {
        not_exists_msg: string;
      };
      500: {
        message: string;
      };
    };
  };

  Login: {
    Success: {
      data: {
        username: string;
        email: string;
        token: string;
        nickname: string;
        is_admin: number;
      };
    };
    Error: {
      401: {
        status_code: number;
        response: {
          status: boolean;
          code: number;
          message: string;
        };
      };
    };
  };
  ADMIN: {
    LOGIN: {
      Success: {
        data: {
          username: string;
          email: string;
          token: string;
          nickname: string;
        };
      };
      ERROR: {
        401: {
          success: boolean;
          message: string;
        };
      };
    };
  };
}
