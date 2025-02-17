import axiosInstance from '@/utils/axiosInstance';

export const getCountries = async () => {
  const response = await axiosInstance.get(
    'https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code'
  );
  return response.data;
};
