import slugify from 'react-slugify';

export const convertToSlug = (text: string) => {
  return slugify(text);
};
