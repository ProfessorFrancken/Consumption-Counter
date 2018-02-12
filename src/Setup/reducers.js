import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { title, products, members, surnameRanges, selectedMember } from '../App/reducer.js'

export default combineReducers({
    title,
    members,
    surnameRanges,
    selectedMember,
    products,
    routing: routerReducer
});
