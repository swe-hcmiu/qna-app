import { RESPONSE_GET_SESSION, REQUEST_GET_SESSION } from '../actions/type';

const initialState = {
  isLoading: false,
  data: [],
};

const sessionReducer = (state = initialState, action) => {
  switch(action.type) {
    case REQUEST_GET_SESSION:
      return {
        ...state,
        isLoading: true,
      };
    case RESPONSE_GET_SESSION:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    default: return state;
  }
};

export default sessionReducer;