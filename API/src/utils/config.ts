require('dotenv').config();
const { PORT } = process.env;
const JWT_SCERET = process.env.SECRET
export default {
  PORT, JWT_SCERET
};
