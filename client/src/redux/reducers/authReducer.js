import { CREATE_ACCOUNT_SUCCESS } from "../actions/type";


const initialState = {
    isAuthenticated: false,
    isRegisterSuccess: false,
    user: {},
};

export default function(state = initialState, action) {
    switch(action.type) {
      case CREATE_ACCOUNT_SUCCESS:
        return action.payload;
      default:
        return state;
    }
}