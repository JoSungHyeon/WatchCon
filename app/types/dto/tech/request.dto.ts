export interface TechRequestDto {
  CREATE: {
    title: string;
    content: string;
    file_yn: 'Y' | 'N';
    file_name: string;
    reply_yn: 'Y' | 'N';
    request_type: number;
    request_name: string;
    request_email: string;
  };

  DELETE: {
    requestId: number;
  };
}
