import axios from 'axios';

export const getCountries = async () => {
  const response = await axios.get(
    'https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code'
  );
  return response.data;
};
