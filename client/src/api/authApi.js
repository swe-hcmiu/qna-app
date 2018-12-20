import axios from 'axios';
import config from '../config';

const url = (path) => (config + path);

const authApi = {
  post_Loign: () => axios.post(url('users/login')),
  post_Register: (userData) =>  axios.post(url('users/register'), userData),
} 

export default authApi;
