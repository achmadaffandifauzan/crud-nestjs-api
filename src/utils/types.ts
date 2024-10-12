export type CreateUserParams = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  hobby?: string;
};
export type UpdateUserParams = {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  hobby?: string;
};
export type CreateNoteParams = {
  title: string;
  description: string;
};
export type LoginParams = {
  username: string;
  password: string;
};
