import {
  Server,
  Response,
  Model,
  Factory,
  belongsTo,
  hasMany,
  trait,
  association
} from 'miragejs';
import faker from 'faker';
import moment from 'moment';

export function makeServer({ environment = 'development' } = {}) {
  let server = new Server({
    logging: true,
    urlPrefix: 'http://francken.nl.localhost/',
    namespace: 'api/plus-one',
    environment,

    models: {
      member: Model,
      product: Model,
      committee: Model.extend({
        committeeMembers: hasMany()
      }),
      committeeMember: Model.extend({
        member: belongsTo(),
        committee: belongsTo()
      }),
      board: Model.extend({
        boardMembers: hasMany()
      }),
      boardMember: Model.extend({
        member: belongsTo(),
        board: belongsTo()
      }),
      categories: Model,
      statistics: Model
    },

    factories: {
      member: Factory.extend({
        id: i => parseInt(i, 10),

        achternaam() {
          return faker.name.lastName();
        },

        voornaam() {
          return faker.name.firstName();
        },

        tussenvoegsel(i) {
          if (i % 3 === 0) {
            return 'de';
          }
          return '';
        },

        initialen() {
          return `${this.voornaam[0]}. ${this.achternaam[0]}.`;
        },

        latest_purchase_at(i) {
          if (i % 10 === 0) {
            return null;
          }
          return moment(faker.date.recent()).format('YYYY-MM-DD HH:MM:SS');
        },
        geboortedatum(i) {
          const birthdate =
            i % 5 === 0
              ? faker.date.past(2, moment().subtract(15, 'years'))
              : faker.date.past(10, moment().subtract(18, 'years'));

          return moment(birthdate).format('YYYY-MM-DD');
        },

        minor: trait({
          birthdate() {
            const birthdate = faker.date.past(
              2,
              moment().subtract(15, 'years')
            );

            return moment(birthdate).format('YYYY-MM-DD');
          }
        }),

        withCommittee: trait({
          afterCreate(member, server) {}
        }),

        small_button: trait({
          button_height: 40,
          button_width: 70
        }),

        button_height(i) {
          if (i === 100) {
            return 70;
          }
          return null;
        },
        button_width(i) {
          if (i === 100) {
            return 70;
          }
          return null;
        },
        bijnaam(i) {
          const nicknames = [null, null, null, null, null, 'hoi'];

          return nicknames[i % nicknames.length];
        },
        afbeelding(i) {
          const backgrounds = [
            null,
            'https://old.professorfrancken.nl/database/streep/afbeeldingen/c538yFPOCdcXhZ6Xqz2l.jpg',
            null,
            null,
            null
          ];

          return backgrounds[i % backgrounds.length];
        },
        kleur(i) {
          const colors = [null, null, null, '#e50000'];

          return colors[i % colors.length];
        },
        prominent: null
      }),

      product: Factory.extend({
        id: i => parseInt(i, 10),
        product_id() {
          return this.id;
        },
        kleur: null,
        splash_afbeelding(i) {
          if (i % 5 === 0) {
            return 'https://old.professorfrancken.nl/database/streep/afbeeldingen/33hu4fj5sXIkUHnW821p.png';
          }
          return null;
        },
        updated_at: '2018-07-12 13:43:31',
        created_at: '0000-00-00 00:00:00',
        eenheden: 0,
        btw: '0.2100',
        afbeelding(i) {
          const images = [
            'https://old.professorfrancken.nl/database/streep/afbeeldingen/wCwnyLXTVdPEnKRXjw9I.png',
            'https://old.professorfrancken.nl/database/streep/afbeeldingen/Kvg0C3298rDYqhfA1dqS.jpg',
            'https://old.professorfrancken.nl/database/streep/afbeeldingen/MWpgAvc1MxIVOGU3HSHj.jpg'
          ];
          return images[i % images.length];
        },
        beschikbaar: 1,
        positie: 1,
        categorie(i) {
          const categories = ['Bier', 'Fris', 'Eten'];

          return categories[i % categories.length];
        },
        prijs() {
          return faker.commerce.price(0.01, 5.0, 4);
        },
        naam(i) {
          return faker.commerce.product();
        }
      }),

      committee: Factory.extend({
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
      }),
      committeeMember: Factory.extend({
        title(i) {
          const functions = ['', '', '', 'Treasurer', 'President'];
          return functions[i % functions.length];
        },

        committee: association(),
        member: association(),

        year(i) {
          return 2018 + (i % 5);
        }
      }),
      board: Factory.extend({
        year(i) {
          return 2020 - (i % 20);
        }
      }),
      boardMember: Factory.extend({
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
      }),
      category: Factory.extend({
        food() {
          return faker.random.number({ min: 0, max: 200 });
        },
        soda() {
          return faker.random.number({ min: 0, max: 100 });
        },
        beer() {
          return faker.random.number({ min: 0, max: 400 });
        },
        date() {
          return moment(faker.date.recent()).format('YYYY-MM-DD');
        }
      })
    },

    seeds(server) {
      server.create('member', {
        latest_purchase_at: '2020-03-08 22:05:49',
        button_height: 0,
        button_width: 0,
        bijnaam: '',
        afbeelding:
          'https://old.professorfrancken.nl/database/streep/afbeeldingen/xtCWQ7vaLKJdSndU1hlv.jpg',
        kleur: '',
        prominent: null,
        geboortedatum: '1993-04-26',
        achternaam: 'Redeman',
        tussenvoegsel: '',
        initialen: 'M.S.',
        voornaam: 'Mark',
        id: 1403
      });
      server.createList('member', 800);
      server.createList('product', 30);
      server.createList('committeeMember', 100);
      server.createList('boardMember', 100);

      const getDaysArray = function(start, end) {
        const days = [];
        for (var date = start; date <= end; date.setDate(date.getDate() + 1)) {
          days.push(new Date(date));
        }
        return days;
      };

      const days = getDaysArray(
        moment()
          .subtract(2, 'years')
          .toDate(),
        moment().toDate()
      ).reverse();

      days.forEach(day => {
        server.create('category', {
          date: moment(day).format('YYYY-MM-DD')
        });
      });
      // const startDate = moment();
    },

    routes() {
      const token =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4';

      this.post('authenticate', (schema, request) => {
        const { password } = JSON.parse(request.requestBody);

        if (password === 'bitterballen') {
          return new Response(
            200,
            { 'content-type': 'application/json' },
            { token }
          );
        }
        return new Response(401, {}, { error: 'unauthorized' });
      });

      this.get('members', schema => {
        const { models } = schema.members.all();

        return { members: models };
      });

      this.get('/products', schema => {
        const { models } = schema.products.all();

        return { products: models };
      });

      this.get('/boards', schema => {
        const { models } = schema.boardMembers.all();
        return {
          boardMembers: models.map(boardMember => ({
            functie: boardMember.title,
            lid_id: boardMember.member.id,
            jaar: boardMember.board.year
          }))
        };
      });

      this.get('committees', schema => {
        const { models } = schema.committeeMembers.all();
        return {
          committees: models.map(committeeMember => ({
            naam: committeeMember.committee.name,
            functie: committeeMember.title,
            jaar: committeeMember.year,
            lid_id: committeeMember.member.id,
            commissie_id: committeeMember.committee.id
          }))
        };
      });

      this.get('*/categories', schema => {
        const { models } = schema.categories.all();

        return { statistics: models };
      });

      this.get('*/activities', () => ({
        activities: [
          {
            endDate: '2018-03-15T00:00:00+00:00',
            startDate: '2018-03-13T00:00:00+00:00',
            location:
              'Martinihal, Leonard Springerlaan 2, 9727 KB Groningen, Netherlands',
            description:
              'The ‘Beta Business Days’ has been an unique multiday career-event for all students of the Faculty of Mathematics and Natural Sciences from the University of Groningen in the Netherlands.\n',
            title: 'Beta Business Days'
          }
        ]
      }));

      this.post('/orders', () => {
        return { order: 1 };
      });

      this.get('https://borrelcie.vodka/chwazorcle/hoeveel.php', () => {
        return 1;
      });

      this.get('https://buixieval.nl/api/backers', schema => {
        const members = [
          {
            id: 1,
            name: 'John',
            contributed: '33.33',
            team: 'p',
            img: '1.jpeg',
            f_id: '314'
          }
        ];
        return members;
      });

      this.get('https://borrelcie.vodka/present/data.php', schema => {
        return ['Mark'];
      });
    }
  });

  server.logging = true;

  return server;
}
