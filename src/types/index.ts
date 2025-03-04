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

export interface RegisterInfo {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface RegisterResponse {
  _isSuccess: string;
  _message: string;
}

export interface LoginResponse {
  _isSuccess: string;
  _message: string;
  _jwt: string;
}
