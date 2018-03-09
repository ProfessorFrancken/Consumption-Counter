import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import { uniqBy, groupBy } from 'lodash';
import { createSelector } from 'reselect';
import Compucie from './Compucie';

const membersSelector = state => state.members;
const committeeMembersSelector = state => state.committeeMembers;

export const compucieSelector = createSelector(
  membersSelector,
  committeeMembersSelector,
  (members, committeeMembers) => {
    const committees = groupBy(
      uniqBy(
        committeeMembers
          .filter(member => {
            return ['Compucie', 's[ck]rip(t|t?c)ie'].includes(
              member.committee.name
            );
          })
          .map(member => {
            const m = members.find(m => m.id === member.member_id);
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
  }
);

const mapStateToProps = state => {
  return compucieSelector(state);
};

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Compucie);
