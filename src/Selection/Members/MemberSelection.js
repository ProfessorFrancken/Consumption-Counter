import { connect } from 'react-redux'
import { selectMember } from '../../actions'
import Members from './Members'

const mapStateToProps = state => {
  return { members: state.members }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectMember: member => {
      dispatch(selectMember(member))
    }
  }
}

const MemberSelection = connect(
  mapStateToProps,
  mapDispatchToProps
)(Members)

export default MemberSelection
