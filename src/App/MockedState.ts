export function mockedState() {
  return {
    order: defaultOrder,
  };
}

export const defaultAuthentication = {
  request: false,
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4",
};

export const defaultOrder = {
  member: {
    fullname: "John snow",
    id: 1,
    firstName: "John",
    surname: "Snow",
    latest_purchase_at: null,
    age: 19,
    prominent: null,
    cosmetics: undefined,
  },
  products: [],
};

export const defaultProducts = {
  Bier: [
    {
      id: 3,
      name: "Hertog Jan",
      price: 68,
      position: 1,
      category: "Bier",
      image: "wCwnyLXTVdPEnKRXjw9I.png",
      splash_image: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
      age_restriction: 18,
    },
  ],
  Fris: [
    {
      id: 27,
      name: "Ice Tea",
      price: 60,
      position: 999,
      category: "Fris",
      image: "",
      age_restriction: null,
    },
  ],
  Eten: [
    {
      id: 243,
      name: "Kinder Bueno",
      price: 55,
      position: 999,
      category: "Eten",
      image: "utnCWM87tZclyENVrG03.jpg",
      age_restriction: null,
    },
  ],
};

export const defaultMembers = [
  {
    id: 1,
    firstName: "John",
    surname: "Snow",
    fullname: "John Snow",
    age: 18,
    latest_purchase_at: "2018-01-01 00:00:00",
    prominent: null,
    cosmetics: {
      color: null,
      image: null,
      nickname: null,
      button: {
        width: null,
        height: null,
      },
    },
  },
];

export const defaultCommitteeeMembers = [
  {
    member_id: 1,
    year: 2018,
    function: "King",
    committee: {
      id: 0,
      name: "Compucie",
    },
  },
];

export const defaultBoardMembers = [{member_id: 1, function: "King"}];

export const mocks = {
  members: [
    {
      id: 314,
      voornaam: "John",
      initialen: "",
      tussenvoegsel: "",
      achternaam: "Snow",
      geboortedatum: "1993-04-26",
      prominent: null,
      kleur: null,
      afbeelding: null,
      bijnaam: null,
      button_width: null,
      button_height: null,
      latest_purchase_at: "2018-01-01 00:00:00",
    },
  ],

  products: [
    {
      id: 1,
      naam: "Hertog Jan",
      prijs: "0.6500",
      categorie: "Bier",
      positie: 999,
      beschikbaar: 1,
      afbeelding: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
      splash_afbeelding: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
      kleur: null,
    },
    {
      id: 3,
      naam: "Grolsch",
      prijs: "0.6500",
      categorie: "Eten",
      positie: 999,
      beschikbaar: 1,
      afbeelding: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
      splash_afbeelding: null,
      kleur: null,
    },
    {
      id: 2,
      naam: "Heineken",
      prijs: "0.6000",
      categorie: "Fris",
      positie: 999,
      beschikbaar: 0,
      afbeelding: "",
      splash_afbeelding: null,
      kleur: null,
    },
  ],

  orders: {
    single: {
      order: {
        member: {
          id: 314,
          firstName: "John",
          surname: "Snow",
          fullname: "John Snow",
        },
        products: [
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
          },
        ],
        ordered_at: 1514764800000,
      },
    },
    multiple: {
      order: {
        member: {
          id: 314,
          firstName: "John",
          surname: "Snow",
        },
        products: [
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
          },
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
          },
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
          },
        ],
        ordered_at: 1514764800000,
      },
    },
  },

  committees: [
    {
      commissie_id: 14,
      lid_id: 314,
      jaar: 2018,
      functie: "King",
      naam: "Night's Watch",
    },
    {
      commissie_id: 0,
      lid_id: 314,
      jaar: 2018,
      functie: "King",
      naam: "Compucie",
    },
  ],
  boards: [{lid_id: 314, jaar: 2018, functie: "King"}],
};
