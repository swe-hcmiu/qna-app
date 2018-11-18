import { GET_ERRORS } from "./type";
import axios from 'axios';
// Register
export const registerUser = (userData) => (dispach) => {
  axios
    .post('http://localhost:5000/users/register', userData)
    .then(res => console.log(res.data))
    .catch(err => {
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