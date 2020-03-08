/* eslint-disable no-undef */
import { makeServer } from '../../src/server';
import { TIME_TO_CANCEL } from './../../src/actions';
import { SCREEN_SAVER_TIMEOUT } from './../../src/App/ScreenSaver';

let server;
beforeEach(() => {
  server = makeServer({ environment: 'test' });
});

afterEach(() => {
  server.shutdown();
});

describe('PlusOne.js', () => {
  describe('Authentication', () => {
    it('Authenticates with the plus one API', () => {
      expect(localStorage.getItem('plus_one_authorization')).to.be.null;
      const password = 'bitterballen';

      cy.visit('/settings');
      cy.get('.form-control').type(password);
      cy.get('.mb-5.p-3')
        .get('.btn')
        .click()
        .should(() => {
          const encoded_token = localStorage.getItem('plus_one_authorization');
          expect(encoded_token).to.not.be.null;

          const token = JSON.parse(encoded_token);
          expect(token).to.not.be.null;
        });

      cy.get('.mb-5.p-3')
        .get('.btn')
        .contains('Refresh token');

      cy.visit('/');
      cy.get('.tilesGrid').should('contain', 'Admiraal');
    });
  });

  describe('authenticated session', () => {
    beforeEach(() => {
      cy.login();
    });
    describe('Striping soda & food', () => {
      it('Allows striping soda', () => {
        cy.get('.tilesGrid > :nth-child(1)').click();
        cy.get('.tilesGrid').should('contain', 'Joris Admiraal');
        cy.get('.tilesGrid > :nth-child(1)').click();
        cy.get('.titleName > span').should('contain', 'Joris Admiraal');
        cy.get('.productsGrid > :nth-child(2)').should('contain', 'Ice Tea');
        cy.get('.productsGrid > :nth-child(2) > :nth-child(3)').should(
          'contain',
          'Ice Tea'
        );
        cy.get('.productsGrid > :nth-child(2) > :nth-child(3)').click();
        cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
          'contain',
          'Cancel buying Ice Tea for '
        );
        cy.get('.backButton > span').should('contain', 'Joris Admiraal');
      });

      it('Buying two products using the back button', () => {
        cy.get('.tilesGrid > :nth-child(1)').click();
        cy.get('.tilesGrid').should('contain', 'Joris Admiraal');
        cy.get('.tilesGrid > :nth-child(1)').click();
        cy.get('.titleName > span').should('contain', 'Joris Admiraal');
        cy.get('.productsGrid > :nth-child(2)').should('contain', 'Ice Tea');
        cy.get('.productsGrid > :nth-child(2) > :nth-child(3)').should(
          'contain',
          'Ice Tea'
        );
        cy.get('.productsGrid > :nth-child(2) > :nth-child(3)').click();
        cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
          'contain',
          'Cancel buying Ice Tea for '
        );
        cy.get('.backButton > span').click();
        cy.get('.productsGrid > :nth-child(3) > :nth-child(3)').click();
        cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
          'contain',
          'Cancel buying Mars for '
        );
      });

      it('Showing prices of products', () => {
        cy.get('.tilesGrid > :nth-child(1)').click();
        cy.get('.tilesGrid').should('contain', 'Joris Admiraal');
        cy.get('.tilesGrid > :nth-child(1)').click();
        cy.get('.titleName > span').should('contain', 'Joris Admiraal');
        cy.get('.productsGrid > :nth-child(2)').should('contain', 'Ice Tea');
        cy.get('.productsGrid > :nth-child(2) > :nth-child(3)').should(
          'contain',
          'Ice Tea'
        );

        cy.get('.header > :nth-child(2) > a').click();
        cy.get('.productsGrid > :nth-child(2) > :nth-child(3)').should(
          'contain',
          '0.61'
        );
      });

      it('Allows buying multiple products at once', () => {
        cy.get('.tilesGrid > :nth-child(1)').click();
        cy.get('.tilesGrid').should('contain', 'Joris Admiraal');
        cy.get('.tilesGrid > :nth-child(1)').click();
        cy.get('.titleName > span').should('contain', 'Joris Admiraal');
        cy.get('.productsGrid > :nth-child(2)').should('contain', 'Ice Tea');
        cy.get('.productsGrid > :nth-child(2) > :nth-child(3)')
          .should('contain', 'Ice Tea')
          .trigger('mousedown');
        cy.wait(1000);
        cy.get('.productsGrid > :nth-child(2) > :nth-child(3)')
          .should('contain', '1')
          .click()
          .click()
          .should('contain', '3');

        cy.get('.productsGrid > :nth-child(3) > :nth-child(1)')
          .click()
          .should('contain', '1');

        cy.get('.buyAllButton').should('contain', 'Buy it all!');
      });

      it('Shows a warning when selecting an inactive member', () => {
        const future = new Date(2022, 2, 2, 13).getTime();
        cy.clock(future, ['Date']);

        const stub = cy.stub();
        stub.onFirstCall().returns(false);
        cy.on('window:confirm', stub);

        cy.get(`.tilesGrid > :nth-child(1)`).click();
        cy.get(`.tilesGrid > :nth-child(1)`)
          .click()
          .then(() => {
            expect(stub.getCall(0)).to.be.calledWith(
              `Are you sure you want to select Joris Admiraal`
            );
            cy.get('.tilesGrid').should('contain', 'Joris Admiraal');
          });
      });

      it('Allows selecting an inactive member after confirmation', () => {
        const future = new Date(2022, 2, 2, 13).getTime();
        cy.clock(future, ['Date']);

        const stub = cy.stub();
        stub.onFirstCall().returns(true);
        cy.on('window:confirm', stub);

        cy.get(`.tilesGrid > :nth-child(1)`).click();
        cy.get(`.tilesGrid > :nth-child(1)`)
          .click()
          .then(() => {
            expect(stub.getCall(0)).to.be.calledWith(
              `Are you sure you want to select Joris Admiraal`
            );
            cy.get('.titleName > span').should('contain', 'Joris Admiraal');
            cy.location('pathname').should('eq', '/products');
          });
      });
    });

    describe('Prominent', () => {
      it('Buying via prominent', () => {
        cy.get('[href="/prominent"]').click();
        cy.get('.boardsRow > :nth-child(2) > :nth-child(5)')
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
        cy.get('[href="/prominent"]').click();
        cy.get('.prominentRow > .tile').should(
          'contain',
          'ir. Guus Berend Winter'
        );
      });
    });

    describe('Recent', () => {
      it('Shows members that recently bought a product', () => {
        cy.clock();

        cy.selectMember();
        cy.buyIceTea();
        cy.tick(TIME_TO_CANCEL);

        cy.selectMember({
          nthSurname: 4,
          nthFirstname: 1,
          name: 'Pol de Dalman'
        });
        cy.buyIceTea();
        cy.tick(TIME_TO_CANCEL);

        cy.get('[href="/recent"]').click();
        cy.get('.titleName > span').should('contain', 'Recent');
        cy.get('.tilesGrid > :nth-child(1)').should('contain', 'Pol de Dalman');
        cy.get('.tilesGrid > :nth-child(2)').should(
          'contain',
          'Joris Admiraal'
        );
      });
    });

    describe('Present', () => {
      it.skip('People currently at Francken', () => {
        cy.get('.TilesGrid').should('contain', 'Ids');
      });
    });

    describe('Commitees', () => {
      it('Allows selecting a member via committees', () => {
        cy.get('[href="/committees"]').click();
        cy.get('.titleName > span').should('contain', 'Committees');

        cy.get('.tilesGrid > :nth-child(1)')
          .should('contain', 'Lustrumweek')
          .click();
        cy.get('.titleName > span').should('contain', 'Lustrumweek');

        cy.get('.tilesGrid').should('contain', "Le'âh!");
        cy.get('.tilesGrid > :nth-child(2)').click();
        cy.get('.titleName > span').should('contain', 'Arjen Kramer');
      });
    });

    describe('Compucie', () => {
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
          cy.selectMember();
          cy.buyIceTea();
          cy.visit('/settings');
          cy.get('tbody > tr').should('contain', 'Joris Admiraal');
          cy.get('tbody > tr').should('contain', 'Ice Tea');
          cy.get('tbody > tr').should('contain', 'queued');
          cy.get('tbody > tr').should('contain', 'Retry now');
          cy.get('tbody > tr').should('contain', 'Cancel');
        });

        it('Allows cancelling a queued order', () => {
          cy.selectMember();
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
          cy.selectMember();
          cy.get(
            `.productsGrid > :nth-child(${category}) > :nth-child(1)`
          ).click();
          cy.tick(2 * TIME_TO_CANCEL);
        });

        cy.get('[href="/statistics"]').click();
        cy.get('.titleName > span').should('contain', 'Statistics');

        cy.get('.recent-orders')
          .find('.recent-order')
          .should('have.length', 3);
        cy.get('.recent-orders')
          .find('.recent-order')
          .then(orders => {
            cy.log('hier hier hier');
            cy.log(orders);
            cy.wrap(Cypress.$(orders[0])).should(
              'contain',
              'bought by Joris Admiraal'
            );

            cy.wrap(Cypress.$(orders[1])).should(
              'contain',
              'bought by Joris Admiraal'
            );

            cy.wrap(Cypress.$(orders[2])).should(
              'contain',
              'bought by Joris Admiraal'
            );

            cy.wrap(Cypress.$(orders[0])).should('contain', 'M&Ms');
            cy.wrap(Cypress.$(orders[1])).should('contain', 'Hero Cassis');
            cy.wrap(Cypress.$(orders[2])).should('contain', 'Hertog Jan');
          });
      });
    });

    describe('Screensaver / Bug free zone', () => {
      it('Goes to the statistics page after a long idle time', () => {
        cy.clock();
        cy.selectMember();

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
        cy.selectMember();

        cy.get('.productsGrid > :nth-child(2) > :nth-child(11)').should(
          'contain',
          'Pepsi max'
        );
        cy.get('.productsGrid > :nth-child(2) > :nth-child(11)').click();
        cy.get('.wrapper').should(
          'have.css',
          'background-image',
          'url("https://old.professorfrancken.nl/database/streep/afbeeldingen/ECDOccDsQVmRRRpyBnN1.jpeg")'
        );
      });

      it('Shows a small member button', () => {
        cy.get(`.tilesGrid > :nth-child(14)`).click();
        cy.get('.tilesGrid').should('contain', 'Nina');

        cy.get(`.tilesGrid > :nth-child(26)`).should(
          'have.css',
          'transform',
          'matrix(0.5, 0, 0, 0.5, 0, 0)'
        );
      });

      it('Shows a member button with background', () => {
        cy.get('[href="/prominent"]').click();
        const jeanne = cy.get('.boardsRow > :nth-child(1) > :nth-child(4)');
        jeanne.should('contain', 'Dictadtor');
        jeanne.should(
          'have.css',
          'background-image',
          'url("https://old.professorfrancken.nl/database/streep/afbeeldingen/nc1J3sNtthqGkeQy0tDf.jpeg")'
        );
      });

      it('Locks goedemorgen after 12', () => {
        const after12 = new Date(2020, 2, 2, 13).getTime();
        cy.clock(after12, ['Date']);

        cy.selectMember();
        cy.get('.productsGrid > :nth-child(2) > :nth-child(4)')
          .should('contain', 'Goede morgen')
          .should('have.class', 'locked');
      });
    });

    describe('Sponsor opportunities', () => {
      it('Shows logos of companies sponsoring the system', () => {
        cy.visit('/');
        cy.get('.company-logos')
          .find('img')
          .should('have.length', 3);
      });
    });

    describe('Drinking rules', () => {
      it('Does not allow striping beer before 4', () => {
        const before4 = new Date(2020, 2, 2, 13).getTime();
        cy.clock(before4, ['Date']);

        cy.selectMember();

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

        cy.selectMember();

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
});
