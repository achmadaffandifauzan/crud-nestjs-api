export type CreateUserParams = {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  hobby?: string;
};
export type UpdateUserParams = {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  hobby?: string;
};
export type CreateUserNoteParams = {
  title: string;
  description: string;
};
export type SignInParams = {
  username: string;
  password: string;
};
