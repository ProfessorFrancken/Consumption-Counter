import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';

const HeatMap = ({ statistics = [] }) => {
  if (statistics.length === 0) {
    return null;
  }

  const end = statistics[0];
  const start = statistics[statistics.length - 1];

  const titleForValue = value => {
    return value
      ? `Date: ${new Date(value.date).toDateString()} - Beer: ${
          value.beer
        }, Food: ${value.food}, Soda: ${value.soda}`
      : null;
  };

  const classToBeUsed = value => {
    return 'color-empty';
    if (!value) {
      return 'color-empty';
    }

    const total = [value.beer, value.soda, value.food].reduce(
      (sum, value) => sum + value,
      0
    );

    if (value.beer >= value.soda && value.beer >= value.food) {
      return `color-mostly-beer`;
    }

    if (value.soda >= value.beer && value.soda >= value.food) {
      return `color-mostly-soda`;
    }

    if (value.food >= value.soda && value.food >= value.beer) {
      return `color-mostly-food`;
    }

    return `color-scale-${value.count}`;
  };

  const totalPurchases = statistics.reduce(
    (sum, statistic) =>
      sum +
      [statistic.beer, statistic.soda, statistic.food].reduce(
        (sum, value) => sum + value ** 1,
        0
      ),
    0
  );
  const averagePurchases = totalPurchases / statistics.length;

  const colorToBeUsed = value => {
    if (value.date === null) {
      return 'rgba(0, 0, 0, 0)';
    }

    if (
      [value.beer, value.soda, value.food].reduce(
        (sum, value) => sum + value,
        0
      ) === 0
    ) {
      console.log('moimoimoi');
    }

    const total = [value.beer, value.soda, value.food].reduce(
      (sum, value) => sum + value ** 1,
      0
    );

    const totalSq = total * total;

    const steps = 255;

    const normed = [
      Math.floor(steps * value.beer ** 1 / total),
      Math.floor(steps * value.soda ** 1 / total),
      Math.floor(steps * value.food ** 1 / total)
    ];

    const bases = [
      // [243 / 255, 240 / 255, 77 / 255], // beer
      [236 / 255, 118 / 255, 8 / 255], // beer
      [191 / 255, 63 / 255, 174 / 255], // soda
      [63 / 255, 191 / 255, 180 / 255] // food
      // [0, 0, 0], // empty
    ];

    // const bases = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    const color = [
      bases[0][0] * normed[0] +
        bases[1][0] * normed[1] +
        bases[2][0] * normed[2],
      bases[0][1] * normed[0] +
        bases[1][1] * normed[1] +
        bases[2][1] * normed[2],
      bases[0][2] * normed[0] +
        bases[1][2] * normed[1] +
        bases[2][2] * normed[2]
    ];

    return `rgba(
        ${255 * color[0] / steps},
        ${255 * color[1] / steps},
        ${255 * color[2] / steps},
        ${Math.min(1, total / averagePurchases)}
        )`;
  };

  const tooltip = value => {
    if (value === null || value.date === null) {
      return undefined;
    }

    if (
      [value.beer, value.soda, value.food].reduce(
        (sum, value) => sum + value,
        0
      ) === 0
    ) {
      return undefined;
    }

    return { style: { fill: colorToBeUsed(value) } };
  };

  return (
    <CalendarHeatmap
      horizontal={false}
      startDate={new Date(start.date)}
      endDate={new Date(end.date)}
      values={statistics}
      titleForValue={titleForValue}
      gutterSize={3}
      showWeekdayLabels={true}
      classForValue={classToBeUsed}
      tooltipDataAttrs={tooltip}
      onClick={value => console.log(value, tooltip(value))}
    />
  );
};

export default HeatMap;
