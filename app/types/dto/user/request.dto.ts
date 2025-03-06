export interface UserRequestDto {
  MAILING_LIST: {
    POST: {
      receiver_list: string[];
      title: string;
      content: string;
      from_where: number;
      attached_file: string;
    };
  };
}
