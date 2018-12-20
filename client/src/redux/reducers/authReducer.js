import { REQUEST_POST, RECEIVE_POST, SET_CURRENT_USER } from "../actions/type";
import isEmpty from '../utils/isEmpty';

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: {},
};

export default function(state = initialState, action) {
    switch(action.type) {
      case REQUEST_POST:
        return {
          ...state,
          isLoading: true,
        };
      
      case RECEIVE_POST:
        return {
          ...state,
          isLoading: false,
        };
      
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload,
        };
      default:
        return state;
    }
};