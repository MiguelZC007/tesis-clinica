export class JwtArgs {
  jwtToken: string;
  expiresIn: string;
}

export class AuthResponse {
  id: string;
  fullname: string;
  birthdate: Date;
  cellphone: string;
  email: string;
  ci: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  jwtParams: JwtArgs
}
