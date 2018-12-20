import { GET_ERRORS, REQUEST_POST, RECEIVE_POST, SET_CURRENT_USER } from "./type";
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import config from '../../config';


// Action
const requestPost = (userInput) => ({
  type: REQUEST_POST,
  userInput,
});

const receivePost = (userInput) => ({
  type: RECEIVE_POST,
  userInput,
});



// Register
export const registerUser = (userInput) => (dispatch) => {

  dispatch(requestPost(userInput));
  
  axios
    .post(config.url + 'users/register', userInput)
    .then(res => res.json)
    .then(json => dispatch( receivePost(userInput, json)))
    .catch(err => {
      console.log(err);
      let tempErr = Object.values(err.response.data.errors.description);
      var resObject = tempErr.reduce((res, cur) => {
        for(let key in cur) {
          if(cur.hasOwnProperty(key)) {
            res[key] = cur[key];
          }
        }
        return res;
      }, {});
      
      // dispatch action
      dispatch({
        type: GET_ERRORS, 
        payload: resObject,
      });
    }); 
}


// Login
export const loginUser = (userInput) => (dispatch) => {

  dispatch(requestPost(userInput));

  axios.post(`${config.url}users/login`, userInput) 
  .then(res => {
    // save to local storage
    const { token } = res.data;
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    console.log('decode', decoded);
    
    // set current user
    dispatch(setCurrentUser(decoded));
  })
  .catch(err => {
    console.log(err);
    let tempErr = Object.values(err.response.data.errors);    
    dispatch({
      type: GET_ERRORS,
      payload: tempErr,
    })
  })
}


export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  }
}

// user log out
export const logOutUser = () => (dispatch) => {
  localStorage.removeItem('jwtToken');
  // remove auth header for future req
  setAuthToken(false);
  // set current to empty object => is authenticate = false
  dispatch(setCurrentUser({}));
}
