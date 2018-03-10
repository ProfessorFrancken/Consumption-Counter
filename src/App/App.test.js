import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import App from './App';
import configureMockStore from 'redux-mock-store';
import AvailableProducts from './Products/AvailableProducts';
import Prominent from './Prominent';
import RecentMembers from './Recent';

function setup(routes = ['/']) {
  const props = {};

  const mockStore = configureMockStore([]);
  const store = mockStore(mockedState());
  const app = mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={routes}>
        <App {...props} />
      </MemoryRouter>
    </Provider>
  );

  return { props, app, store };
}

describe('rendering', () => {
  it('renders without crashing', () => {
    const { app } = setup();

    expect(app.find('Header').length).toBe(1);
    expect(app.find('AppContent').length).toBe(1);
    expect(app.find('Footer').length).toBe(1);
  });

  it('shows a selection of surname ranges by default', () => {
    const { app } = setup();

    expect(app.find('SurnameRanges').length).toBe(1);
  });

  describe('rendering screens depending on state', () => {
    const screens = [
      { path: '/', component: 'SurnameRanges' },
      { path: '/prominent', component: Prominent },
      { path: '/statistics', component: 'Statistics' },
      { path: '/committees', component: 'Committees' },
      { path: '/committees/0', component: 'Members' },
      { path: '/pricelist', component: 'PriceList' },
      { path: '/recent', component: RecentMembers },
      { path: '/products', component: AvailableProducts },
      { path: '/members', component: 'SurnameRanges' },
      { path: '/members/0', component: 'Members' }
    ];

    screens.forEach(screen => {
      it(`renders ${screen.path}`, () => {
        const { app } = setup([screen.path]);

        expect(app.find(screen.component).length).toBe(1);
      });
    });
  });
});

/* xit('should show a loading message when refreshing the database')*/

function mockedState() {
  return {
    title: "T.F.V. 'Professor Francken'",
    members: [
      {
        id: 999,
        firstName: 'John',
        surname: 'Snow',
        age: 18,
        prominent: null,
        cosmetics: {
          color: null,
          image: null,
          nickname: null,
          button: {
            width: null,
            height: null
          }
        }
      }
    ],
    surnameRanges: {
      members_per_range: 30,
      ranges: [
        {
          idx: 0,
          members: [
            {
              id: 1,
              firstName: 'John',
              surname: 'Snow',
              age: 18,
              prominent: null,
              cosmetics: {
                color: null,
                image: null,
                nickname: null,
                button: {
                  width: null,
                  height: null
                }
              }
            }
          ],
          surname_start: 'Snow',
          surname_end: 'Snow'
        }
      ]
    },
    products: {
      Bier: [
        {
          id: 3,
          name: 'Hertog Jan',
          price: 68,
          position: 1,
          category: 'Bier',
          image: 'wCwnyLXTVdPEnKRXjw9I.png',
          age_restriction: 18
        }
      ],
      Fris: [
        {
          id: 27,
          name: 'Ice Tea',
          price: 60,
          position: 999,
          category: 'Fris',
          image: '',
          age_restriction: 18
        }
      ],
      Eten: [
        {
          id: 243,
          name: 'Kinder Bueno',
          price: 55,
          position: 999,
          category: 'Eten',
          image: 'utnCWM87tZclyENVrG03.jpg',
          age_restriction: 18
        }
      ]
    },
    router: {
      locationBeforeTransitions: null
    },
    order: {
      member: {
        id: 1,
        fullName: 'Mark Redeman',
        age: 19
      },
      products: []
    },
    transactions: [],
    boardMembers: [],
    committeeMembers: [
      {
        commissie_id: 0,
        lid_id: 314,
        jaar: 2018,
        functie: 'King',
        naam: 'Compucie'
      }
    ],
    queuedOrder: null
  };
}
