import {Activity} from "App/Activities/ActivitiesContext";
import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import {Statistic} from "./StatisticsContext";

const HeatMap: React.FC<{
  statistics: Statistic[];
  activities: Activity[];
}> = ({statistics = [], activities = []}) => {
  if (statistics.length === 0) {
    return null;
  }
  const end = statistics[0];
  const start = statistics[statistics.length - 1];
  const titleForValue = (value: any) => {
    if (value === null) {
      return null;
    }
    const activity = activities.find(
      (activity) => (activity as any).startDate === value.date
    );
    if (activity) {
      return `Date: ${new Date(value.date).toDateString()} - Activty: ${
        (activity as any).title
      }- Beer: ${value.beer}, Food: ${value.food}, Soda: ${value.soda}`;
    }
    return `Date: ${new Date(value.date).toDateString()} - Beer: ${value.beer}, Food: ${
      value.food
    }, Soda: ${value.soda}`;
  };
  const classToBeUsed = (value: any) => {
    if (!value) {
      return "color-empty";
    }
    const activity = activities.find(
      (activity) => (activity as any).startDate === value.date
    );
    return activity ? "activity" : "color-empty";
  };
  const totalPurchases = statistics.reduce(
    (sum, {beer, soda, food}) => sum + beer + soda + food,
    0
  );
  const averagePurchases = totalPurchases / statistics.length;
  const colorToBeUsed = (value: any) => {
    if (value.date === null) {
      return "rgba(0, 0, 0, 0)";
    }
    if (
      [value.beer, value.soda, value.food].reduce((sum, value) => sum + value, 0) === 0
    ) {
    }
    const total = [2 * value.beer, value.soda, value.food].reduce(
      (sum, value) => sum + value ** 1,
      0
    );
    const steps = 255;
    const normed = [
      Math.floor((2 * steps * value.beer ** 1) / total),
      Math.floor((steps * value.food ** 1) / total + (steps * value.soda ** 1) / total),
      0,
    ];
    const bases = [
      // [243 / 255, 240 / 255, 77 / 255], // beer
      // [236 / 255, 118 / 255, 8 / 255], // beer
      // [191 / 255, 63 / 255, 174 / 255], // soda
      // [63 / 255, 191 / 255, 180 / 255] // food
      [23 / 255, 50 / 255, 73 / 255],
      // [191 / 255, 63 / 255, 174 / 255], // soda
      // [63 / 255, 191 / 255, 180 / 255] // food
      [140 / 255, 211 / 255, 203 / 255],
      [23 / 255, 50 / 255, 73 / 255],
    ];
    // const bases = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const color = [
      bases[0][0] * normed[0] + bases[1][0] * normed[1] + bases[2][0] * normed[2],
      bases[0][1] * normed[0] + bases[1][1] * normed[1] + bases[2][1] * normed[2],
      bases[0][2] * normed[0] + bases[1][2] * normed[1] + bases[2][2] * normed[2],
    ];
    return `rgba(
        ${(255 * color[0]) / steps},
        ${(255 * color[1]) / steps},
        ${(255 * color[2]) / steps},
        ${Math.min(1, total / averagePurchases)}
        )`;
  };
  const tooltip = (value: any) => {
    if (value === null || value.date === null) {
      return undefined;
    }
    if (
      [value.beer, value.soda, value.food].reduce((sum, value) => sum + value, 0) === 0
    ) {
      return undefined;
    }
    return {style: {fill: colorToBeUsed(value)}};
  };
  return (
    <CalendarHeatmap
      horizontal={true}
      startDate={new Date((start as any).date)}
      endDate={new Date((end as any).date)}
      values={statistics}
      titleForValue={titleForValue}
      gutterSize={3}
      showWeekdayLabels={true}
      classForValue={classToBeUsed}
      tooltipDataAttrs={tooltip}
      onClick={(value: any) =>
        console.log(
          value,
          tooltip(value),
          activities.find((activity) => (activity as any).startDate === value.date)
        )
      }
      showOutOfRangeDays={true}
    />
  );
};

export default HeatMap;
