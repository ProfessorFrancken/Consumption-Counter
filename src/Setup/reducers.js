import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { title, products, members, selectedMember } from '../App/reducer.js'

export default combineReducers({
    title,
    members,
    selectedMember,
    products,
    routing: routerReducer
});
