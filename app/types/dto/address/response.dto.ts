export interface AddressItem {
  LIST: {
    GET: {
      status_code: number;
      message: string;
      data: {
        list: {
          row_id: string;
          id: string;
          username: string;
          password: string;
          hostname: string;
          alias: string;
          platform: string;
          tags: string;
          hash: string;
          user_id: number;
          force_always_relay: number;
          rdp_port: string;
          rdp_username: string;
          online: number;
          login_name: string;
          same_server: number;
          collection_id: string;
          created_at: string;
          updated_at: string | null;
        }[];
        page: number;
        total: number;
        page_size: number;
      };
    };
  };

  UPDATE: {
    status_code: number;
    message: string;
    data: {
      row_id: string;
      id: string;
      username: string;
      password: string;
      hostname: string;
      alias: string;
      platform: string;
      tags: string[];
      hash: string;
      user_id: string;
      force_always_relay: number;
      rdp_port: string;
      rdp_username: string;
      online: number;
      login_name: string;
      same_server: number;
      collection_id: string;
      created_at: string;
      updated_at: string | null;
    };
  };
}
