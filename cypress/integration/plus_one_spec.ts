/* eslint-disable no-undef */
import { makeServer } from '../../src/server/';
import { TIME_TO_CANCEL } from './../../src/actions';
import { SCREEN_SAVER_TIMEOUT } from './../../src/App/ScreenSaver';
import { association } from 'miragejs';
import moment from 'moment';

const member = {
  firstName: 'Joris',
  lastName: 'Aaaaadmiraal',
  fullName: 'Joris Aaaaadmiraal'
};

let server;
beforeEach(() => {
  server = makeServer({ environment: 'test' });
  server.logging = true;
  server.create('member', {
    latest_purchase_at: '2020-03-08 22:05:49',
    geboortedatum: '1993-04-26',
    achternaam: member.lastName,
    voornaam: member.firstName,
    tussenvoegsel: '',
    bijnaam: ''
  });

  server.create('member', {
    id: 1403,
    latest_purchase_at: '2020-03-08 22:05:49',
    geboortedatum: '1993-04-26',
    achternaam: 'Redeman',
    voornaam: 'Mark',
    tussenvoegsel: '',
    bijnaam: ''
  });

  server.create('product', {
    categorie: 'Bier',
    naam: 'Hertog Jan'
  });

  server.create('product', {
    categorie: 'Eten',
    naam: 'Mars'
  });

  server.create('product', {
    categorie: 'Fris',
    naam: 'Ice Tea',
    prijs: '0.6100'
  });
});

afterEach(() => {
  server.shutdown();
});

describe('PlusOne.js', () => {
  beforeEach(() => {
    cy.login();
  });
  describe('Striping soda & food', () => {
    it('Allows striping soda', () => {
      cy.visit('/');
      cy.get('.tilesGrid').should('not.be.empty');

      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.tilesGrid').should('contain', member.fullName);
      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.titleName > span').should('contain', member.fullName);
      cy.get('.productsGrid > :nth-child(2)').should('contain', 'Ice Tea');
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').should(
        'contain',
        'Ice Tea'
      );
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').click();
      cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
        'contain',
        'Cancel buying Ice Tea for '
      );
      cy.get('.backButton > span').should('contain', member.fullName);
    });

    it('Buying two products using the back button', () => {
      cy.visit('/');
      cy.get('.tilesGrid').should('not.be.empty');

      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.tilesGrid').should('contain', member.fullName);
      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.titleName > span').should('contain', member.fullName);
      cy.get('.productsGrid > :nth-child(2)').should('contain', 'Ice Tea');
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').should(
        'contain',
        'Ice Tea'
      );
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').click();
      cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
        'contain',
        'Cancel buying Ice Tea for '
      );
      cy.get('.backButton > span').click();
      cy.get('.productsGrid > :nth-child(3) > :nth-child(1)').click();
      cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
        'contain',
        'Cancel buying Mars for '
      );
    });

    it('Showing prices of products', () => {
      cy.visit('/');
      cy.get('.tilesGrid').should('not.be.empty');

      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.tilesGrid').should('contain', member.fullName);
      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.titleName > span').should('contain', member.fullName);
      cy.get('.productsGrid > :nth-child(2)').should('contain', 'Ice Tea');
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').should(
        'contain',
        'Ice Tea'
      );

      cy.contains('Show prices').click();
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').should(
        'contain',
        '0.61'
      );

      cy.contains('Buy products').click();
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').should(
        'contain',
        'Ice Tea'
      );
    });

    it('Allows buying multiple products at once', () => {
      cy.clock();
      cy.visit('/');
      cy.get('.tilesGrid').should('not.be.empty');

      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.tilesGrid').should('contain', member.fullName);
      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.titleName > span').should('contain', member.fullName);
      cy.get('.productsGrid > :nth-child(2)').should('contain', 'Ice Tea');
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)')
        .should('contain', 'Ice Tea')
        .trigger('mousedown');

      cy.tick(1000);
      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)')
        .should('contain', '1')
        .click()
        .click()
        .should('contain', '3');

      cy.get('.productsGrid > :nth-child(3) > :nth-child(1)')
        .click()
        .should('contain', '1');

      cy.get('.buyAllButton').should('contain', 'Buy it all!');

      cy.get('.buyAllButton').click();

      cy.get('.cancelButton').should(
        'contain',
        'Cancel buying multiple products'
      );
    });

    it('Shows a warning when selecting an inactive member', () => {
      const future = new Date(2022, 2, 2, 13).getTime();
      cy.clock(future, ['Date']);

      const stub = cy.stub();
      stub.onFirstCall().returns(false);
      cy.on('window:confirm', stub);

      cy.visit('/');
      cy.get('.tilesGrid').should('not.be.empty');

      cy.get(`.tilesGrid > :nth-child(1)`).click();
      cy.get(`.tilesGrid > :nth-child(1)`)
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith(
            `Are you sure you want to select ${member.fullName}`
          );
          cy.get('.tilesGrid').should('contain', member.fullName);
        });
    });

    it('Allows selecting an inactive member after confirmation', () => {
      const future = new Date(2022, 2, 2, 13).getTime();
      cy.clock(future, ['Date']);

      const stub = cy.stub();
      stub.onFirstCall().returns(true);
      cy.on('window:confirm', stub);

      cy.visit('/');
      cy.get('.tilesGrid').should('not.be.empty');

      cy.get(`.tilesGrid > :nth-child(1)`).click();
      cy.get(`.tilesGrid > :nth-child(1)`)
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith(
            `Are you sure you want to select ${member.fullName}`
          );
          cy.get('.titleName > span').should('contain', member.fullName);
          cy.location('pathname').should('eq', '/products');
        });
    });
  });

  describe('Prominent', () => {
    it('Buying via prominent', () => {
      server.create('boardMember', {
        board: association({
          year: 2017
        }),
        member: association({
          id: 1403,
          latest_purchase_at: '2020-03-08 22:05:49',
          geboortedatum: '1993-04-26',
          achternaam: 'Redeman',
          voornaam: 'Mark',
          tussenvoegsel: '',
          bijnaam: ''
        })
      });
      cy.refreshApp();

      cy.get('[href="/prominent"]').click();
      cy.get('.boardsRow > :nth-child(1) > :nth-child(1)')
        .should('contain', 'Mark Redeman')
        .click();

      cy.get('.titleName > span').should('contain', 'Mark Redeman');
      cy.get('.productsGrid > :nth-child(1) > :nth-child(1)').click();
      cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
        'contain',
        'Cancel buying Hertog Jan for '
      );
    });

    it('Board member from 5 years ago', () => {
      const date = new Date(2020, 2, 2, 17).getTime();
      cy.clock(date, ['Date']);

      server.create('boardMember', {
        board: association({
          year: 2010
        }),
        member: association({
          id: 9999,
          latest_purchase_at: '2020-03-08 22:05:49',
          achternaam: 'Bosma',
          voornaam: 'Tom',
          tussenvoegsel: '',
          bijnaam: 'Tom Bosma'
        })
      });
      server.createList('boardMember', 5, {
        board: association({ year: 2020 })
      });
      server.createList('boardMember', 5, {
        board: association({ year: 2019 })
      });
      server.createList('boardMember', 5, {
        board: association({ year: 2018 })
      });
      server.createList('boardMember', 5, {
        board: association({ year: 2017 })
      });
      server.createList('boardMember', 5, {
        board: association({ year: 2016 })
      });
      cy.refreshApp();

      cy.get('[href="/prominent"]').click();
      cy.get('.prominentRow > .tile').should('contain', 'Tom Bosma');
    });
  });

  describe('Recent', () => {
    beforeEach(() => {
      server.create('member', {
        latest_purchase_at: '2020-03-08 22:05:49',
        geboortedatum: '1993-04-26',
        achternaam: 'Dalman',
        voornaam: 'Pol',
        tussenvoegsel: 'de',
        bijnaam: ''
      });
      cy.login();
    });
    it('Shows members that recently bought a product', () => {
      cy.clock();

      cy.selectMember({ name: member.fullName });
      cy.buyIceTea();
      cy.tick(TIME_TO_CANCEL);

      cy.selectMember({
        nthSurname: 1,
        nthFirstname: 2,
        name: 'Pol de Dalman'
      });
      cy.buyIceTea();
      cy.tick(TIME_TO_CANCEL);

      cy.get('[href="/recent"]').click();
      cy.tick(TIME_TO_CANCEL);

      cy.get('.titleName > span').should('contain', 'Recent');
      cy.get('.tilesGrid > :nth-child(2)').should('contain', member.fullName);
      cy.get('.tilesGrid > :nth-child(1)').should('contain', 'Pol de Dalman');
    });
  });

  describe('Present', () => {
    it('People currently at Francken', () => {
      cy.get('[href="/present"]').click();
      cy.get('.tilesGrid').should('contain', 'Mark Redeman');
    });
  });

  describe('Commitees', () => {
    it('Allows selecting a member via committees', () => {
      server.create('committeeMember', {
        committee: association({
          id: 1,
          name: 'HOI'
        }),
        member: association({
          id: 1403,
          latest_purchase_at: '2020-03-08 22:05:49',
          geboortedatum: '1993-04-26',
          achternaam: 'Redeman',
          voornaam: 'Mark',
          tussenvoegsel: '',
          bijnaam: ''
        }),
        year: 2020
      });
      cy.refreshApp();

      cy.get('[href="/committees"]').click();
      cy.get('.titleName > span').should('contain', 'Committees');

      cy.get('.tilesGrid > :nth-child(1)')
        .should('contain', 'HOI')
        .click();
      cy.get('.titleName > span').should('contain', 'HOI');

      cy.get('.tilesGrid').should('contain', 'Mark Redeman');
      cy.get('.tilesGrid > :nth-child(1)').click();
      cy.get('.titleName > span').should('contain', 'Mark Redeman');
    });
  });

  describe('Compucie', () => {
    beforeEach(() => {
      server.create('committeeMember', {
        committee: association({
          id: 1,
          name: 's[ck]rip(t|t?c)ie'
        }),
        member: association({
          id: 33,
          latest_purchase_at: '2020-03-08 22:05:49',
          geboortedatum: '1993-04-26',
          achternaam: 'Baars',
          voornaam: 'Sven',
          tussenvoegsel: '',
          bijnaam: 'ir. Sven'
        }),
        year: 2020
      });
      cy.refreshApp();
    });

    it('Shows all previous compucie members', () => {
      cy.get('.association').click();
      cy.get('.compucie').should('contain', 'ir. Sven');
      cy.get('.compucie-buttons').should('contain', 'Refresh');
      cy.get('.compucie-buttons').should('contain', 'Guest');
      cy.get('.compucie-buttons').should('contain', 'Overdue');
      cy.get('.compucie-buttons').should('contain', 'Temple Count');
    });

    it('Can be used to go to the settings page', () => {
      cy.get('.association').click();
      cy.get('[href="/settings"]').click();
      cy.get('.content').should('contain', 'Queued Orders');
      cy.get('.content').should('contain', 'Authenticate Plus One');
    });

    describe('The settings page', () => {
      it('Can be used to see the queued orders', () => {
        cy.selectMember({ name: member.fullName });
        cy.buyIceTea();
        cy.visit('/settings');
        cy.get('tbody > tr').should('contain', member.fullName);
        cy.get('tbody > tr').should('contain', 'Ice Tea');
        cy.get('tbody > tr').should('contain', 'queued');
        cy.get('tbody > tr').should('contain', 'Retry now');
        cy.get('tbody > tr').should('contain', 'Cancel');
      });

      it('Allows cancelling a queued order', () => {
        cy.selectMember({ name: member.fullName });
        cy.buyIceTea();
        cy.visit('/settings');

        cy.get('tbody')
          .find('tr')
          .then(oldQueuedOrders => {
            cy.get('tbody > tr:first() .text-danger')
              .should('contain', 'Cancel')
              .click();

            cy.get('tbody')
              .find('tr')
              .should('have.length', Cypress.$(oldQueuedOrders).length - 1);
          });
      });
    });
  });

  describe('Statistics', () => {
    it('Shows the latest purchases', () => {
      cy.clock();

      [1, 2, 3].forEach(category => {
        cy.selectMember({ name: member.fullName });
        cy.get(
          `.productsGrid > :nth-child(${category}) > :nth-child(1)`
        ).click();
        cy.tick(TIME_TO_CANCEL);
      });

      cy.selectMember({ name: member.fullName });
      cy.tick(TIME_TO_CANCEL);

      cy.get('[href="/statistics"]').click();
      cy.get('.titleName > span').should('contain', 'Statistics');

      cy.get('.recent-orders')
        .find('.recent-order')
        .should('have.length', 3);
      cy.get('.recent-orders')
        .find('.recent-order')
        .then(orders => {
          cy.wrap(Cypress.$(orders[0])).should(
            'contain',
            `bought by ${member.fullName}`
          );

          cy.wrap(Cypress.$(orders[1])).should(
            'contain',
            `bought by ${member.fullName}`
          );

          cy.wrap(Cypress.$(orders[2])).should(
            'contain',
            `bought by ${member.fullName}`
          );

          cy.wrap(Cypress.$(orders[0])).should('contain', 'Mars');
          cy.wrap(Cypress.$(orders[1])).should('contain', 'Ice Tea');
          cy.wrap(Cypress.$(orders[2])).should('contain', 'Hertog Jan');
        });
    });

    it('Shows the purchases from last week', () => {
      const thisWeek = [
        // The previous Sunday isn't displayed
        new Date(2020, 2, 8),

        // Start at Monday
        new Date(2020, 2, 9),
        new Date(2020, 2, 10),
        new Date(2020, 2, 11),
        // Up to Thursday
        new Date(2020, 2, 12)
      ];
      thisWeek.forEach((day, idx) => {
        server.create('category', {
          date: moment(day).format('YYYY-MM-DD'),
          beer: 100 * (idx + 1)
        });
      });
      cy.clock(thisWeek[4].getTime(), ['Date']);
      cy.refreshApp();

      cy.get('[href="/statistics"]').click();
      cy.get('.titleName > span').should('contain', 'Statistics');
      cy.get(
        ':nth-child(2) > .p-0 > [style="position: absolute; top: 1em; right: 1em; z-index: 100; text-align: right;"] > .mb-1'
      ).should('contain', '1400');
      cy.get(
        ':nth-child(2) > .p-0 > [style="position: absolute; top: 1em; right: 1em; z-index: 100; text-align: right;"] > .text-uppercase'
      ).should('contain', '500');
    });

    it('Shows a heatmap of busy days', () => {
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
      cy.clock(days[0].getTime(), ['Date']);

      cy.refreshApp();

      cy.get('[href="/statistics"]').click();
      cy.get('.titleName > span').should('contain', 'Statistics');
    });
  });

  describe('Screensaver / Bug free zone', () => {
    it('Goes to the statistics page after a long idle time', () => {
      cy.clock();
      cy.selectMember({ name: member.fullName });

      // Should go back to the members page
      cy.tick(SCREEN_SAVER_TIMEOUT * 1);
      cy.location('pathname').should('eq', '/');

      // Should go to the statistics page after a long wait
      cy.tick(2 * SCREEN_SAVER_TIMEOUT);
      cy.location('pathname').should('eq', '/statistics');
    });
  });

  describe('Easter eggs', () => {
    it('Shows a background of a product', () => {
      server.create('product', {
        categorie: 'Fris',
        naam: 'Pepsi max',
        splash_afbeelding:
          'https://old.professorfrancken.nl/database/streep/afbeeldingen/ECDOccDsQVmRRRpyBnN1.jpeg'
      });
      cy.refreshApp();

      cy.selectMember({ name: member.fullName });

      cy.get('.productsGrid > :nth-child(2) > :nth-child(2)').should(
        'contain',
        'Pepsi max'
      );
      cy.get('.productsGrid > :nth-child(2) > :nth-child(2)').click();
      cy.get('.wrapper').should(
        'have.css',
        'background-image',
        'url("https://old.professorfrancken.nl/database/streep/afbeeldingen/ECDOccDsQVmRRRpyBnN1.jpeg")'
      );
    });

    it('Shows a small member button', () => {
      server.create('member', {
        achternaam: 'Rutten',
        voornaam: 'Nina',
        tussenvoegsel: '',
        bijnaam: 'Nina',
        button_width: 70,
        button_height: 40
      });
      cy.refreshApp();

      cy.get(`.tilesGrid > :nth-child(1)`).click();
      cy.get('.tilesGrid').should('contain', 'Nina');

      cy.get(`.tilesGrid > :nth-child(3)`).should(
        'have.css',
        'transform',
        'matrix(0.5, 0, 0, 0.5, 0, 0)'
      );
    });

    it('Shows a member button with background', () => {
      server.create('boardMember', {
        board: association({
          year: 2019
        }),
        member: association({
          bijnaam: 'Dictadtor',
          afbeelding:
            'https://old.professorfrancken.nl/database/streep/afbeeldingen/nc1J3sNtthqGkeQy0tDf.jpeg'
        })
      });
      cy.refreshApp();

      cy.get('[href="/prominent"]').click();
      const jeanne = cy.get('.boardsRow > :nth-child(1) > :nth-child(1)');
      jeanne.should('contain', 'Dictadtor');
      jeanne.should(
        'have.css',
        'background-image',
        'url("https://old.professorfrancken.nl/database/streep/afbeeldingen/nc1J3sNtthqGkeQy0tDf.jpeg")'
      );
    });

    it('Locks goedemorgen after 12', () => {
      server.create('product', {
        categorie: 'Fris',
        naam: 'Goede morgen!'
      });
      cy.refreshApp();

      const after12 = new Date(2020, 2, 2, 13).getTime();
      cy.clock(after12, ['Date']);

      cy.selectMember({ name: member.fullName });
      cy.get('.productsGrid > :nth-child(2) > :nth-child(2)')
        .should('contain', 'Goede morgen')
        .should('have.class', 'locked');
    });
  });

  describe('Sponsor opportunities', () => {
    it('Shows logos of companies sponsoring the system', () => {
      cy.visit('/');
      cy.get('.tilesGrid').should('not.be.empty');

      cy.get('.company-logos')
        .find('img')
        .should('have.length', 3);
    });
  });

  describe('Drinking rules', () => {
    it('Does not allow striping beer before 4', () => {
      const before4 = new Date(2020, 2, 2, 13).getTime();
      cy.clock(before4, ['Date']);

      cy.selectMember({ name: member.fullName });

      cy.get('.productsGrid > :nth-child(1) > :nth-child(1)').should(
        'have.class',
        'locked'
      );

      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').should(
        'not.have.class',
        'locked'
      );
      cy.get('.productsGrid > :nth-child(3) > :nth-child(1)').should(
        'not.have.class',
        'locked'
      );
    });

    it('Allows striping beer after 4', () => {
      const after4 = new Date(2020, 2, 2, 17).getTime();
      cy.clock(after4, ['Date']);

      cy.selectMember({ name: member.fullName });

      cy.get('.productsGrid > :nth-child(1) > :nth-child(1)').should(
        'not.have.class',
        'locked'
      );

      cy.get('.productsGrid > :nth-child(2) > :nth-child(1)').should(
        'not.have.class',
        'locked'
      );
      cy.get('.productsGrid > :nth-child(3) > :nth-child(1)').should(
        'not.have.class',
        'locked'
      );
    });

    it(`A minor isn't allowed to buy alcohol`, () => {
      const after4 = new Date(2020, 2, 2, 17).getTime();
      cy.clock(after4, ['Date']);
      server.create('member', {
        achternaam: 'Sjaars',
        voornaam: 'Sjaars',
        tussenvoegsel: '',
        bijnaam: 'Sjaars',
        geboortedatum: '2003-01-01'
      });
      cy.refreshApp();

      // Normally we should be able to see beer
      cy.selectMember({ name: member.fullName });
      cy.get('.productsGrid')
        .find('nav')
        .should('have.length', 3);

      // But not if the member is a minor
      cy.get('[href="/"]').click();
      cy.selectMember({ nthFirstname: 3, name: 'Sjaars' });
      cy.get('.productsGrid')
        .find('nav')
        .should('have.length', 2);
    });
  });
});

describe('Reloading the application', () => {
  it('Reloads members when refreshing', () => {
    cy.visit('/compucie');
    cy.get('.compucie-buttons')
      .should('contain', 'Refresh')
      .click();

    cy.visit('/');
    cy.get('.tilesGrid')
      .children()
      .should('have.length', 0);
  });

  it.skip('Shows a loading screen when refreshing the application');
});
