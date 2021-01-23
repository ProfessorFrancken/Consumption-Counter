import moment from "moment";
import {TYPES} from "./actions";
import axios from "axios";

/*
   show winning team on special buixieval page (make it the homepage?)

   buixieval.nl backer view as member selection

   buixieval colors
*/

const pink = {image: null, color: "rgba(255, 153, 255, 255)"};
const blue = {image: null, color: "rgba(1, 255, 255, 255)"};
const bored = {
  image: null,
  background: `linear-gradient(to bottom right, ${blue.color} 50%, ${pink.color} 0%)`,
};

const mapBuixieval = (members: any) => {
  function handleResponse(response: any) {
    return Promise.resolve(response.data);
  }

  const teamColors = (member: any) => {
    if (member.team === "p") {
      return pink;
    }
    if (member.team === "b") {
      return blue;
    }
    if (member.team === "bstuur") {
      return bored;
    }
  };

  return axios
    .get(
      "https://buixieval.nl/api/backers",
      {},
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1-2 arguments, but got 3.
      {
        Authorization: "ErWasEensEenBuixievalInGroningenEnIedereenHadPlezier!HYPE",
      }
    )
    .then(handleResponse)
    .then(({members: buixieval}) =>
      members.map((member: any) => {
        // Check if the member is a buixieval backer
        const buixievalMember = buixieval.find(
          (b: any) => parseInt(b.f_id, 10) === member.id
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
                  typeof cosmetics.nickname === "string" &&
                  cosmetics.nickname.trim() === ""
                    ? null
                    : cosmetics.nickname,
              },
              buixieval: {
                id: buixievalMember.id,
                team: buixievalMember.team,
                contributed: parseFloat(buixievalMember.contributed),
                image: buixievalMember.img,
              },
            };
      })
    );
};

const winningTeamColor = (members: any) => {
  const contributed = (members: any) =>
    members.reduce(
      (total: any, member: any) =>
        total + (member.buixieval ? member.buixieval.contributed : 0),
      0.0
    );

  const team = (members: any, name: any) =>
    members.filter((member: any) => member.buixieval && member.buixieval.team === name);

  const pinkContribution = contributed(team(members, "p"));
  const blueContribution = contributed(team(members, "b"));

  return blueContribution > pinkContribution ? blue.color : pink.color;
};

const buixieval = (fetch: any, date: any) => {
  // if date not in buixieval period do nothing
  if (!moment(date).isBetween("2018-04-14", "2018-04-22")) {
    return (store: any) => (next: any) => (action: any) => next(action);
  }

  return (store: any) => (next: any) => (action: any) => {
    // When loading members, overwrite the cosmetics of members who've
    // contributed to buixieval
    if (action.type === TYPES.FETCH_MEMBERS_SUCCESS) {
      return mapBuixieval(action.members)
        .then((members) => {
          const body = document.getElementsByTagName("body")[0];

          body.style.setProperty("--sidebar-primary", winningTeamColor(members));

          return next({...action, members});
        })
        .catch((e) => next(action));
    }

    return next(action);
  };
};

export default buixieval;
