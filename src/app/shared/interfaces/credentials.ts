export interface Credentials {
  username: string;
  password: string;
}

export interface CreateCredentials extends Credentials {
  email: string;
  passwordConfirm: string;
}