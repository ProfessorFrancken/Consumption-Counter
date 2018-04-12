import moment from 'moment';
import { TYPES } from './actions';
/*
   show winning team on special buixieval page (make it the homepage?)

   buixieval.nl backer view as member selection

   buixieval colors
*/
const mapBuixieval = members => {
  function handleResponse(response) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }

    return response.json();
  }

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

  return fetch('https://buixieval.nl/api/backers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'ErWasEensEenBuixievalInGroningenEnIedereenHadPlezier!HYPE'
    }
  })
    .then(handleResponse)
    .then(buixieval =>
      members.map(member => {
        // Check if the member is a buixieval backer
        const buixievalMember = buixieval.find(
          b => parseInt(b.f_id, 10) === member.id
        );

        const cosmetics = member.cosmetics;

        return !buixievalMember
          ? member
          : {
              ...member,
              cosmetics: {
                ...cosmetics,
                ...teamColors(buixievalMember),

                // Normally a mmeber would be able to be recognized by their picture,
                // but now we will overwrite the picture by a common background so
                // we should display a nonempty nickname or their fullname
                nickname:
                  typeof cosmetics.nickname === 'string' &&
                  cosmetics.nickname.trim() === ''
                    ? null
                    : cosmetics.nickname
              },
              buixieval: {
                id: buixievalMember.id,
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
  if (!moment(date).isBetween('2018-04-14', '2018-04-22')) {
    return store => next => action => next(action);
  }

  return store => next => action => {
    // When loading members, overwrite the cosmetics of members who've
    // contributed to buixieval
    if (action.type === TYPES.FETCH_MEMBERS_SUCCESS) {
      return mapBuixieval(action.members)
        .then(members => next({ ...action, members }))
        .catch(() => next(action));
    }

    return next(action);
  };
};

export default buixieval;
