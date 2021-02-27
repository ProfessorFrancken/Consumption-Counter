import {Factory} from "miragejs";
import faker from "faker";
import moment from "moment";

export const CategoryFactory = Factory.extend({
  food() {
    return faker.random.number({min: 0, max: 200});
  },
  soda() {
    return faker.random.number({min: 0, max: 100});
  },
  beer() {
    return faker.random.number({min: 0, max: 400});
  },
  date() {
    return moment(faker.date.recent()).format("YYYY-MM-DD");
  },
});

export const ActivityFactory = Factory.extend({});

export const seedStatistics = (server: any) => {
  const getDaysArray = function (start: any, end: any) {
    const days = [];
    for (var date = start; date <= end; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
  };

  const days = getDaysArray(
    moment().subtract(2, "years").toDate(),
    moment().toDate()
  ).reverse();

  days.forEach((day) => {
    server.create("category", {
      date: moment(day).format("YYYY-MM-DD"),
    });
  });
};
