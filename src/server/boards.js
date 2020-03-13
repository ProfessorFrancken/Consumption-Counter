import { Factory, association } from 'miragejs';

export const BoardFactory = Factory.extend({
  year(i) {
    return 2020 - (i % 20);
  }
});

export const BoardMemberFactory = Factory.extend({
  title(i) {
    const functions = [
      'President',
      'Treasurer',
      'Secretary',
      'Intern',
      'Extern'
    ];
    return functions[i % functions.length];
  },

  board: association(),
  member: association()
});
