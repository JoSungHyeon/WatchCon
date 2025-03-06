export interface ReplyResponseDto {
  id: string;
  request_id: string;
  append_id: string | null;
  depth: string;
  content: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
}

export interface ReplyListResponse {
  status_code: number;
  message: string;
  data: {
    list: ReplyResponseDto[];
    total: number;
  };
}
