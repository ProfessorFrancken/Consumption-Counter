import { Factory, association } from 'miragejs';

export const CommitteeFactory = Factory.extend({
  id(i) {
    return parseInt(i % 40, 10);
  },
  name(i) {
    if (i % 40 === 1) {
      return 'Compucie';
    }
    if (i % 40 === 2) {
      return 's[ck]rip(t|t?c)ie';
    }
    return `Committee ${i % 40}`;
  }
});

export const CommitteeMemberFactory = Factory.extend({
  title(i) {
    const functions = ['', '', '', 'Treasurer', 'President'];
    return functions[i % functions.length];
  },

  committee: association(),
  member: association(),

  year(i) {
    return 2018 + (i % 5);
  }
});
