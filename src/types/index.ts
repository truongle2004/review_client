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

export interface Category {
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

export interface Image {
  id: number;
  position: number;
  src: string;
  alt: string;
}

export interface Product {
  id: number;
  category: Category;
  description: string;
  images: Image[];
  rating: number;
  title: string;
}

// Define common types
export type UserPublicInfo = Pick<UserInfo, 'id' | 'username' | 'profile_image'>;
export type ProductSummary = Pick<Product, 'id' | 'title'>;

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  roles: string;
  password: string;
  profile_image: string;
}

export interface Review {
  review_created_at: Date;
  review_id: string;
  review_title: string;
  review_rating: number;
  content: string;
  user_id: string;
  user_username: string;
  profile_id: string;
  profile_profile_picture: string;
  product_id: number;
  product_title: string;
  commentCount: string;
  review_images: ReviewImage[];
}

export interface Comment {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
  };
  images: string[] | null;
  children: Comment[];
}

export interface ReviewImage {
  filename: string;
  url: string;
  fullpath: string;
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

export interface RefreshTokenResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface CommentResponse {
  status: number;
  message: string;
  data: {
    comments: Comment[];
  };
}

export interface ProfileInfo {
  id: string;
  profile_picture: string;
  country: string;
  phone: string;
  gender: string;
  birthday: string;
  bio: string;
}

export interface UpdateProfileInfo {
  userId: string;
  profilePicture: string;
  country: string;
  phone: string;
  gender: string;
  birthday: Date;
  bio: string;
}

export interface UserProfileResponse {
  message: string;
  data: {
    id: string;
    email: string;
    username: string;
    status: string;
    roles: string;
    profile: ProfileInfo;
  };
}
