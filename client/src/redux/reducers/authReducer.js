import { CREATE_ACCOUNT_SUCCESS, SET_CURRENT_USER } from "../actions/type";
import isEmpty from '../utils/isEmpty';

const initialState = {
    isAuthenticated: false,
    isRegisterSuccess: false,
    user: {},
};

export default function(state = initialState, action) {
    switch(action.type) {
      case CREATE_ACCOUNT_SUCCESS:
        return action.payload;
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload,
        }
      default:
        return state;
    }
}