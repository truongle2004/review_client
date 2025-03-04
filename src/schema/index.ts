import { z } from 'zod';

export const login_schema = z.object({
  email: z.string().email().nonempty({ message: 'Email is required' }),
  password: z.string(),
});

export const profile_schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z
    .string()
    .nonempty({ message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username cannot exceed 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  email: z
    .string()
    .nonempty({
      message: 'Email is required',
    })
    .email({ message: 'Invalid email address' }),
});

export const register_schema = z
  .object({
    // firstName: z.string(),
    // lastName: z.string(),
    username: z
      .string()
      .nonempty({ message: 'Username is required' })
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(20, { message: 'Username cannot exceed 20 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
      }),
    email: z
      .string()
      .nonempty({
        message: 'Email is required',
      })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .nonempty({ message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(50, { message: 'Password cannot exceed 50 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/\d/, { message: 'Password must contain at least one digit' })
      .regex(/[@$!%*?&]/, {
        message: 'Password must contain at least one special character (@, $, !, %, *, ?, &)',
      }),
    confirmPassword: z.string().nonempty({ message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
