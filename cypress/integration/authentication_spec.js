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
  server.create('member', {
    latest_purchase_at: '2020-03-08 22:05:49',
    geboortedatum: '1993-04-26',
    achternaam: member.lastName,
    voornaam: member.firstName,
    tussenvoegsel: '',
    bijnaam: ''
  });
});

afterEach(() => {
  server.shutdown();
});

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

    cy.location('pathname').should('eq', '/loading');
    cy.get('.tile').should('contain', 'Open application');
    cy.get('.tile').click();
    cy.get('.tilesGrid').should('contain', member.lastName);

    cy.visit('/settings');
    cy.get('.mb-5.p-3')
      .get('.btn')
      .contains('Refresh token');
  });
});
