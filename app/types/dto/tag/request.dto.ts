export interface TagRequestDto {
  CREATE: {
    name: string;
  };

  UPDATE: {
    id: string;
    name: string;
  };

  DELETE: {
    id: string;
  };
}
