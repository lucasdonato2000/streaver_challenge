export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type ActionResponse<T = void> = {
  success: true;
  data?: T;
} | {
  success: false;
  error: string;
};
