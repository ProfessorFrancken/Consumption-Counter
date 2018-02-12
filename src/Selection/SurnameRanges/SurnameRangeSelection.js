import { connect } from 'react-redux'
import SurnameRanges from './SurnameRanges'

const mapStateToProps = state => {
  return { ranges: state.surnameRanges.ranges }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectRange: range => {
      dispatch({
        type: 'SELECT_SURNAME_RANGE',
        range
      })
    }
  }
}

const SurnameRangesSelection = connect(
  mapStateToProps,
  /* mapDispatchToProps*/
)(SurnameRanges)

export default SurnameRangesSelection
