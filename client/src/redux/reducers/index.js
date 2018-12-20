import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorsReducer from './errorsReducer';
import sessionReducer from './sessionReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorsReducer,
    session: sessionReducer,
});