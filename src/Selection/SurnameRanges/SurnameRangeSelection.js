import { connect } from 'react-redux'
import SurnameRanges from './SurnameRanges'
import { selectRangeOfSurnames } from './../../actions'

const mapStateToProps = state => {
  return { ranges: state.surnameRanges.ranges }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectRange: range => {
      dispatch(selectRangeOfSurnames(range))
    }
  }
}

const SurnameRangesSelection = connect(
  mapStateToProps,
  mapDispatchToProps
)(SurnameRanges)

export default SurnameRangesSelection
