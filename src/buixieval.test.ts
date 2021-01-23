import {TYPES} from "./actions";
import buixieval from "./buixieval";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'moxi... Remove this comment to see the full error message
import moxios from "moxios";
import moment from "moment";

describe("buixieval", () => {
  const flushAllPromises = () => new Promise((resolve) => setImmediate(resolve));

  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  const create = (members: any, date: any) => {
    if (moment(date).isBetween("2018-04-14", "2018-04-22")) {
      moxios.stubRequest("https://buixieval.nl/api/backers", {
        response: {members},
      });
    }

    const store = {
      getState: jest.fn(() => ({})),
      dispatch: jest.fn(),
    };

    const next = jest.fn();

    const invoke = (action: any) => buixieval(fetch, date)(store)(next)(action);

    return {store, next, invoke};
  };

  it("adds buixieval information to members", (done) => {
    const date = new Date("2018-04-15");

    const members = [
      {
        id: 1,
        name: "John",
        contributed: "33.33",
        team: "p",
        img: "1.jpeg",
        f_id: "314",
      },
    ];

    const {next, invoke} = create(members, date);

    invoke({
      type: TYPES.FETCH_MEMBERS_SUCCESS,
      members: [
        {
          id: 314,
          age: 17,
          firstName: "John",
          surname: "Snow",
          fullname: "John Snow",
          prominent: null,
          cosmetics: {
            color: null,
            image: null,
            nickname: null,
            button: {
              height: null,
              width: null,
            },
          },
        },
      ],
    });

    flushAllPromises()
      .then(() => {
        expect(next).toHaveBeenCalledWith({
          type: TYPES.FETCH_MEMBERS_SUCCESS,
          members: [
            {
              id: 314,
              age: 17,
              firstName: "John",
              surname: "Snow",
              fullname: "John Snow",
              prominent: null,
              cosmetics: {
                color: "rgba(255, 153, 255, 255)",
                image: null,
                nickname: null,
                button: {
                  height: null,
                  width: null,
                },
              },
              buixieval: {
                id: 1,
                team: "p",
                contributed: 33.33,
                image: "1.jpeg",
              },
            },
          ],
        });
        done();
      })
      .catch((e) => done.fail(e));
  });

  it("does nothing when not in the buixieval period", (done) => {
    const date = new Date("2018-04-12");

    const members = [
      {
        id: 1,
        name: "John",
        contributed: "33.33",
        team: "p",
        img: "1.jpeg",
        f_id: "314",
      },
    ];

    const {next, invoke} = create(members, date);

    invoke({
      type: TYPES.FETCH_MEMBERS_SUCCESS,
      members: [
        {
          id: 314,
          age: 17,
          firstName: "John",
          surname: "Snow",
          fullname: "John Snow",
          prominent: null,
          cosmetics: {
            color: null,
            image: null,
            nickname: null,
            button: {
              height: null,
              width: null,
            },
          },
        },
      ],
    });

    flushAllPromises()
      .then(() => {
        expect(next).toHaveBeenCalledWith({
          type: TYPES.FETCH_MEMBERS_SUCCESS,
          members: [
            {
              id: 314,
              age: 17,
              firstName: "John",
              surname: "Snow",
              fullname: "John Snow",
              prominent: null,
              cosmetics: {
                color: null,
                image: null,
                nickname: null,
                button: {
                  height: null,
                  width: null,
                },
              },
            },
          ],
        });
        done();
      })
      .catch((e) => done.fail(e));
  });
});
