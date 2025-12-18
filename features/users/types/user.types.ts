export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type UserSearchResult = {
  id: number;
  name: string;
  username: string;
  postsCount: number;
};
