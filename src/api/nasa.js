import axios from "axios";

const NASA_API_KEY = "IzOacyJEbSk4bjAyGWWF98WvtvtubhgAnoxH9wnz"; 
const BASE_URL = "https://api.nasa.gov";

export const getAPOD = async () => {
  const res = await axios.get(`${BASE_URL}/planetary/`, {
    params: {
      api_key: NASA_API_KEY,
    },
  });
  console.log(res.data)
  return res.data;
};
