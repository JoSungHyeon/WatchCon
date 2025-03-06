export interface ReplyRequestDto {
  POST: {
    request_id: number;
    append_id: number;
    depth: number;
    file_yn: 'Y' | 'N';
    file_name: string;
    title: string;
    content: string;
  };
}
