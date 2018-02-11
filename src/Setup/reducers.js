import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { title, products, members, selected_member } from '../App/reducer.js'

export default combineReducers({
    title,
    members,
    selected_member,
    products,
    routing: routerReducer
});
