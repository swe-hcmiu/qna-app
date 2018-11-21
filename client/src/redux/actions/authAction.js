import { GET_ERRORS, CREATE_ACCOUNT_SUCCESS, SET_CURRENT_USER } from "./type";
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
// Register
export const registerUser = (userData) => (dispach) => {
  axios
    .post('http://localhost:5000/users/register', userData)
    .then(res => {
      dispach({
        type: CREATE_ACCOUNT_SUCCESS,
        payload: {
          isRegisterSuccess: true,
        },
      });
    })
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
      // console.log('first Name', resObject.FirstName);
      dispach({
        type: GET_ERRORS, 
        payload: resObject,
      });
      // this.setState({ errors: resObject })
    });
}


// Login
export const loginUser = (userData) => (dispach) => {
  axios.post('http://localhost:5000/users/login', userData) 
  .then(res => {
    // save to local storage
    const { token } = res.data;
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    console.log('decode', decoded);
    
    // set current user
    dispach(setCurrentUser(decoded));
  })
  .catch(err => {
    console.log(err);
    let tempErr = Object.values(err.response.data.errors);    
    dispach({
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
export const logOutUser = () => (dispach) => {
  localStorage.removeItem('jwtToken');
  // remove auth header for future req
  setAuthToken(false);
  // set current to empty object => is authenticate = false
  dispach(setCurrentUser({}));
}