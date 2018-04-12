import moment from 'moment';
import { TYPES } from './actions';
/*
   show winning team on special buixieval page (make it the homepage?)

   buixieval.nl backer view as member selection

   buixieval colors
*/
const mapBuixieval = members => {
  const pink = { image: null, color: 'rgba(255, 153, 255, 255)' };
  const blue = { image: null, color: 'rgba(1, 255, 255, 255)' };
  const bored = {
    image: null,
    background: `linear-gradient(to bottom right, ${blue.color} 50%, ${
      pink.color
    } 0%)`
  };

  const teamColors = member => {
    if (member.team === 'p') {
      return pink;
    }
    if (member.team === 'b') {
      return blue;
    }
    if (member.team === 'bstuur') {
      return bored;
    }
  };

  return fetch('http://buixieval.nl/api/backers', {
    method: 'GET',
    headers: {
      Authorization: 'ErWasEensEenBuixievalInGroningenEnIedereenHadPlezier!HYPE'
    }
  })
    .then(
      buixieval => buixieval.json(),
      // Buixieval is not a crucial component of Plus One, so if it fails, ignore the rest
      error => []
    )
    .then(buixieval =>
      members.map(member => {
        // Check if the member is a buixieval backer
        const buixievalMember = buixieval.find(
          b => parseInt(b.f_id, 10) === member.id
        );

        return !buixievalMember
          ? member
          : {
              ...member,
              cosmetics: {
                ...member.cosmetics,
                ...teamColors(buixievalMember),

                // Normally a mmeber would be able to be recognized by their picture,
                // but now we will overwrite the picture by a common background so
                // we should display a nonempty nickname or their fullname
                nickname: member.nickname === '' ? null : member.nickname
              },
              buixieval: {
                team: buixievalMember.team,
                contributed: buixievalMember.contributed,
                image: buixievalMember.img
              }
            };
      })
    );
};

const buixieval = (fetch, date) => {
  // if date not in buixieval period do nothing
  if (!moment(date).isBetween('2010-04-14', '2018-04-22')) {
    return store => next => action => next(action);
  }

  return store => next => action => {
    // When loading members, overwrite the cosmetics of members who've
    // contributed to buixieval
    if (action.type === TYPES.FETCH_MEMBERS_SUCCESS) {
      return mapBuixieval(action.members).then(members =>
        next({ ...action, members })
      );
    }

    return next(action);
  };
};

export default buixieval;
