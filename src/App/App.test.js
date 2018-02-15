import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import App from './App';
import configureMockStore from 'redux-mock-store'

function setup(additionalProps = {}, additionalState = {}) {
  const props = { ...additionalProps }

  const store = configureMockStore([])
  const app = mount(
    <Provider store={store({ ...mockedState(), ...additionalState })}>
      <MemoryRouter>
        <App {...props}/>
      </MemoryRouter>
    </Provider>
  )

  return {props, app}
}

describe('rendering', () => {
  it('renders without crashing', () => {
    const { app } = setup()

    expect(app.find('Header').length).toBe(1)
    expect(app.find('AppContent').length).toBe(1)
    expect(app.find('Footer').length).toBe(1)
  })

  it('shows a selection of surname ranges by default', () => {
    const { app } = setup()

    expect(app.find('SurnameRanges').length).toBe(1)
  })
})

/* xit('should show a loading message when refreshing the database')*/


function mockedState() {
  return {
    title: "T.F.V. 'Professor Francken'",
    members: [
      {
        id: 999,
        firstName: "John",
        surname: "Snow",
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
      },
    ],
    surnameRanges: {
      members_per_range: 30,
      ranges: [
        {
          members: [
		        {
		   	      id: 1,
              firstName: "John",
              surname: "Snow",
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
          surname_start: "Snow",
          surname_end: "Snow"
        },
      ]
    },
    selectedMemberRange: {
      members: []
    },
    selectedMember: {
      id: 1,
      fullName: "Mark Redeman",
      age: 19
    },
    products: {
      Bier: [
        {
          id: 3,
          name: "Hertog Jan",
          price: "0.6800",
          position: 1,
          category: "Bier",
          image: "wCwnyLXTVdPEnKRXjw9I.png",
          age_restriction: 18
        },
      ],
      Fris: [
        {
          id: 27,
          name: "Ice Tea",
          price: "0.6000",
          position: 999,
          category: "Fris",
          image: "",
          age_restriction: 18
        },
      ],
      Eten: [
        {
          id: 243,
          name: "Kinder Bueno",
          price: "0.5500",
          position: 999,
          category: "Eten",
          image: "utnCWM87tZclyENVrG03.jpg",
          age_restriction: 18
        },
      ]
    },
    router: {
      locationBeforeTransitions: null
    }
  }
}
