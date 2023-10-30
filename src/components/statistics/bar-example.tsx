import {useMemo} from "react";
import {BarStack, Bar} from "@visx/shape";
import {Group} from "@visx/group";
import {AxisBottom} from "@visx/axis";
import {scaleBand, scaleLinear, scaleOrdinal} from "@visx/scale";
import {timeParse, timeFormat} from "@visx/vendor/d3-time-format";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

type PurchaseType = "beer" | "soda" | "food" | "total";
type Purchase = {
  date: Date;
  beer: number;
  soda: number;
  food: number;
  total: number;
};

export type BarStackProps = {
  width: number;
  height: number;
  margin?: {top: number; right: number; bottom: number; left: number};
  events?: boolean;

  purchases: Purchase[];
  type: "beer" | "soda" | "food" | "total";
};

const defaultMargin = {top: 0, right: 0, bottom: 0, left: 0};

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%a");
const formatDate = (date: string) => format(parseDate(date)!);

// accessors
const toYYYYMMDD = timeFormat("%Y-%m-%d");
const getDate = ({date}: Purchase) => toYYYYMMDD(date);

function BarExample({
  width,
  height,
  margin = defaultMargin,
  purchases,
  type,
}: BarStackProps) {
  const data = purchases;

  const dateScale = useMemo(
    () =>
      scaleBand({
        domain: data.map(getDate),
        padding: 0.6,
        range: [0, width],
        round: true,
      }),
    [data, width]
  );

  const yMax = height - margin.top - 30;

  const purchaseScale = useMemo(() => {
    const purchaseTotals = data.reduce((allTotals, currentDate) => {
      allTotals.push(currentDate[type]);

      return allTotals;
    }, [] as number[]);

    return scaleLinear<number>({
      domain: [0, Math.max(...purchaseTotals)],
      nice: true,
      range: [yMax, 0],
    });
  }, [data, yMax, type]);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <Group>
        {data.map((purchase) => {
          const date = getDate(purchase);
          const x = dateScale(date);
          const height = purchaseScale(purchase[type]);
          const width = dateScale.bandwidth();

          return (
            <Bar
              key={date}
              width={width}
              x={x}
              y={height}
              fill="#6c757d"
              height={purchaseScale.range()[0] - height}
            />
          );
        })}

        <AxisBottom
          top={yMax}
          scale={dateScale}
          tickFormat={formatDate}
          stroke={""}
          hideTicks
          hideAxisLine
          tickLabelProps={{
            fontSize: 11,
            textAnchor: "middle",
            color: "#6c757d",
            fill: "rgb(108, 117, 125)",
          }}
        />
      </Group>
    </svg>
  );
}

export function WeeklyPurchasesAsBarGraph({
  purchases,
  type,
}: {
  purchases: Purchase[];
  type: PurchaseType;
}) {
  return (
    <ParentSize debounceTime={10}>
      {({width, height}) => (
        <BarExample width={width} height={height} type={type} purchases={purchases} />
      )}
    </ParentSize>
  );
}
