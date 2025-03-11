import type { JwtPayload } from 'jwt-decode';

export interface CountryOption {
  value: string;
  label: string;
  flag?: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
}

type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface Timestamp {
  createdAt: Date | null;
  updatedAt: Date | null;
  deleteAt: Date | null;
}

export interface Category extends Timestamp {
  id: number;
  name: string;
  description: string;
}

export interface ProductPaginateResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface Image extends Timestamp {
  id: number;
  position: number;
  src: string;
  alt: string;
}

export interface Product extends Timestamp {
  id: number;
  category: Category;
  description: string;
  images: Image[];
  rating: number;
  title: string;
}

// Define common types
export type UserPublicInfo = Pick<UserInfo, 'id' | 'username'>;
export type ProductSummary = Pick<Product, 'id' | 'title'>;

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  roles: string;
  password: string;
}

export interface ReviewResponse {
  createdAt: Date;
  id: string;
  title: string;
  rating: number;
  content: string;
  user: UserPublicInfo;
  product: ProductSummary;
}

export type RegisterInfo = Omit<UserInfo, 'id' | 'roles'> & { confirmPassword: string };
export type LoginInfo = Pick<UserInfo, 'email' | 'password'>;

export interface RegisterResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface TokenResponse extends JwtPayload {
  userId: string;
  username: string;
  email: string;
  roles: string;
}
