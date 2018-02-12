import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { title, products, members, surnameRanges, selectedMemberRange, selectedMember } from '../App/reducer.js'

export default combineReducers({
    title,
    members,
    surnameRanges,
    selectedMemberRange,
    selectedMember,
    products,
    router: routerReducer
});
