export interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  role?: 'ADMIN' | 'USER' | 'MANAGER';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRequestDTO {
  name?: string;
  username?: string;
  email?: string;
  password: string;
  role?: 'ADMIN' | 'USER' | 'MANAGER';
}

export interface UserResponseDTO {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  role?: 'ADMIN' | 'USER' | 'MANAGER';
  createdAt?: string;
  updatedAt?: string;
}