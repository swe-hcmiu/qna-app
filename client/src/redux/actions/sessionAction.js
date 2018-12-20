import { RESPONSE_GET_SESSION, REQUEST_GET_SESSION } from './type';
import axios from 'axios';
import config from '../../config';

const requestGet = () => ({
  type: REQUEST_GET_SESSION,
});

const responseGetSession = (res) => ({
  type: RESPONSE_GET_SESSION,
  data: res.data,
});

export const getListOfSession = () => (dispatch) => {
  dispatch(requestGet());
  //console.log('aaaaaaaaaaa');
  axios
    .get(`${config.url}api/sessions`)
    .then(res => {
      // console.log(res);
      dispatch(responseGetSession(res));
    })
    .catch(err => console.log(err));
    
};