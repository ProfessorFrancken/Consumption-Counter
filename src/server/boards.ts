// @ts-expect-error ts-migrate(2305) FIXME: Module '"miragejs"' has no exported member 'associ... Remove this comment to see the full error message
import {Factory, association} from "miragejs";

export const BoardFactory = Factory.extend({
  year(i: any) {
    return 2020 - (i % 20);
  },
});

export const BoardMemberFactory = Factory.extend({
  title(i: any) {
    const functions = ["President", "Treasurer", "Secretary", "Intern", "Extern"];
    return functions[i % functions.length];
  },

  board: association(),
  member: association(),
});
