import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import { uniqBy, groupBy } from 'lodash';
import Compucie from './Compucie';

const mapStateToProps = state => {
  const committees = groupBy(
    uniqBy(
      state.committeeMembers
        .filter(member => {
          return ['Compucie', 's[ck]rip(t|t?c)ie'].includes(
            member.committee.name
          );
        })
        .map(member => {
          const m = state.members.find(m => m.id === member.member_id);
          return m !== undefined
            ? { ...m, name: member.committee.name }
            : undefined;
        })
        .filter(m => m !== undefined),
      member => member.id
    ),
    member => member.name
  );

  return {
    compucie: committees['Compucie'] || [],
    scriptcie: committees['s[ck]rip(t|t?c)ie'] || []
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectMember: member => {
      dispatch(selectMember(member));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Compucie);
