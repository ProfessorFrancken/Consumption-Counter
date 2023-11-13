// @ts-expect-error ts-migrate(2305) FIXME: Module '"miragejs"' has no exported member 'associ... Remove this comment to see the full error message
import {Factory, association} from "miragejs";
import {ApiBoardsResponse} from "../../queries/boards";
import {ArrayElement} from "../../types";

export const BoardFactory = Factory.extend({
  year(i: number) {
    return 2020 - (i % 20);
  },
});

export const BoardMemberFactory = Factory.extend({
  title(i: number) {
    const functions = ["President", "Treasurer", "Secretary", "Intern", "Extern"];
    return functions[i % functions.length];
  },

  board: association(),
  member: association(),
});

type ApiBoardMember = ArrayElement<ApiBoardsResponse["boardMembers"]>;
const functions = [
  "President",
  "Treasurer",
  "Secretary",
  "Intern",
  "Extern",
  "Education",
];

export const getBoardMemberApi = (
  boardMember: Partial<ApiBoardMember>
): ApiBoardMember => {
  const idx = boardMember.lid_id ?? 0;

  return {
    functie: functions[idx % functions.length],
    lid_id: 0,
    jaar: new Date().getFullYear(),
    ...boardMember,
  };
};
