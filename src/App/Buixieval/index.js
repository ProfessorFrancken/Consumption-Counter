import { connect } from 'react-redux';
import { selectMember } from '../../actions';

import Buixieval from './Buixieval';

const mapStateToProps = ({ members }) => ({
  members: members
    .filter(
      member =>
        member.buixieval &&
        (member.buixieval.team === 'p' || member.buixieval.team === 'b')
    )
    .map(member =>
      Object.assign({}, member, {
        buixieval: Object.assign({}, member.buixieval, {
          contributed: parseFloat(member.buixieval.contributed)
        })
      })
    )
    .sort((a, b) => b.buixieval.contributed - a.buixieval.contributed)
});

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Buixieval);
