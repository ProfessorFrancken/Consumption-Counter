import {useEffect, useMemo, useState} from "react";
import {BarStack} from "@visx/shape";
import {Group} from "@visx/group";
import {AxisBottom, AxisLeft} from "@visx/axis";
import {
  AnyD3Scale,
  getTicks,
  scaleBand,
  ScaleInput,
  scaleLinear,
  scaleOrdinal,
  scaleThreshold,
} from "@visx/scale";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import {GridRows, GridColumns} from "@visx/grid";
import {useCommittees} from "queries/committees";
import moment, {Moment} from "moment";
import {Spring} from "react-spring";
import {
  XYChart,
  lightTheme as theme,
  AnimatedBarStack,
  AnimatedBarSeries as BarSeries,
  AnimatedAxis,
  AnimatedGrid,
} from "@visx/xychart";
import {LegendThreshold, LegendOrdinal} from "@visx/legend";

export default function getSubTicks<Scale extends AnyD3Scale>(
  scale: Scale,
  numTicks?: number
): ScaleInput<Scale>[] {
  // Because `Scale` is generic type which maybe a subset of AnyD3Scale
  // that may not have `ticks` field,
  // TypeScript will not let us do the `'ticks' in scale` check directly.
  // Have to manually cast and expand type first.
  const s = scale;

  if ("ticks" in s) {
    return s.ticks(numTicks * 2);
  }

  return scale.domain().filter((_, index, arr) => {
    return (
      numTicks == null ||
      arr.length <= numTicks ||
      index % Math.round((arr.length - 1) / numTicks) === 0
    );
  });
}

type Field = "beer" | "soda" | "food";
type CommitteeData = {
  name: string;
  beer: number;
  soda: number;
  food: number;
};

export type BarStackProps = {
  width: number;
  height: number;
  margin?: {top: number; right: number; bottom: number; left: number};
  events?: boolean;

  data: {name: string; beer: number; soda: number; food: number}[];
};

const defaultMargin = {top: 40, right: 80, bottom: 40, left: 40};

const keys = ["beer", "food", "soda"];

// https://medium.com/vx-code/getting-started-with-vx-1756bb661410

function BarExample({width, height, margin: old = defaultMargin, data}: BarStackProps) {
  const margin = {top: 40, right: 40, bottom: 80, left: 40};

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleBand({
        domain: data.map((d) => d.name),
        padding: 0.6,
        range: [0, xMax],
        round: true,
      }),
    [data, xMax]
  );

  const yScale = useMemo(() => {
    const purchaseTotals = data.map((committee) => {
      return committee.beer + committee.food + committee.soda;
    });

    return scaleLinear<number>({
      domain: [0, Math.max(...purchaseTotals)],
      nice: true,
      range: [yMax, 0],
    });
  }, [data, yMax]);

  const colorScale = useMemo(
    () => scaleOrdinal({domain: keys, range: ["#6c757d", "red", "green"]}),
    [keys]
  );

  const threshold = scaleOrdinal({
    domain: ["Beer", "Food", "Soda"],
    range: theme.colors,
  });

  const subGridTicks = getTicks(yScale, 3 * 10);
  console.log(theme);

  return (
    <div className="w-100 h-100">
      <div style={{position: "absolute"}}>
        <LegendOrdinal scale={threshold} />
      </div>
      <div className="w-100 h-100">
        <XYChart
          theme={theme}
          xScale={{type: "band", padding: 0.5}}
          yScale={{type: "linear"}}
        >
          <AnimatedGrid
            key={`grid`} // force animate on update
            rows={true}
            columns={false}
            //animationTrajectory={animationTrajectory}
            //numTicks={numTicks}
          />

          <AnimatedBarStack>
            <BarSeries
              dataKey="Beer"
              data={data}
              xAccessor={(d) => d.name}
              yAccessor={(d) => d.beer}
              //colorAccessor={(d) => "red"}
            />
            <BarSeries
              dataKey="Food"
              data={data}
              xAccessor={(d) => d.name}
              yAccessor={(d) => d.food}
              //colorAccessor={(d) => "green"}
            />
            <BarSeries
              dataKey="Soda"
              data={data}
              xAccessor={(d) => d.name}
              yAccessor={(d) => d.soda}
              //colorAccessor={(d) => "blue"}
            />
          </AnimatedBarStack>
          <AnimatedAxis
            animationTrajectory="min"
            orientation="bottom"
            key="hoi"
            tickLabelProps={{
              fontSize: 11,
              textAnchor: "middle",
              color: "#6c757d",
              fill: "rgb(108, 117, 125)",
            }}
            numTicks={data.length}
            tickComponent={(props) => {
              const tickLabelSize = 10;
              const tickRotate = -33;
              const tickColor = "#8e205f";
              const tick = props;
              const tickX = tick.x;
              const tickY = tick.y + 20; //+ tickLabelSize + props.tickLength;

              //console.log("ticking", tick);
              return (
                <text
                  transform={`translate(-10, 20) rotate(${tickRotate})`}
                  fontSize={tickLabelSize}
                  textAnchor="middle"
                >
                  {tick.formattedValue}
                </text>
              );

              //const axisCenter = (props.axisToPoint.x - props.axisFromPoint.x) / 2;

              return <text>hoi</text>;
            }}
          />
          <AnimatedAxis
            animationTrajectory="min"
            orientation="left"
            tickLabelProps={{
              fontSize: 10,
              textAnchor: "middle",
              color: "#6c757d",
              fill: "rgb(108, 117, 125)",
            }}
            label="Consumptions"
          />
        </XYChart>
      </div>
    </div>
  );
}

type TimeScale = "day" | "week" | "month" | "year";

export function Committees() {
  const {committees} = useCommittees();
  const getData = () => {
    return [...committees].map((c, idx) => {
      return {
        name: `Committee ${idx}`,
        beer: Math.ceil(330 * Math.random()),
        food: Math.ceil(330 * Math.random()),
        soda: Math.ceil(330 * Math.random()),
      };
    });
  };

  const [data, setData] = useState(getData);

  useEffect(() => {
    setData(getData());
  }, [committees]);

  const [timeScale, setTimeScale] = useState<TimeScale>("week");
  const [timeRange, setTimeRange] = useState<[Moment, Moment]>(() => {
    const now = moment();
    const monday = now.clone().startOf("week");
    const sunday = now.clone().endOf("week");

    return [monday, sunday];
  });

  const next = () => {
    const start = timeRange[0].add(1, timeScale);
    setTimeRange([start, start.clone().endOf(timeScale)]);
  };

  const previous = () => {
    const start = timeRange[0].subtract(1, timeScale);
    setTimeRange([start, start.clone().endOf(timeScale)]);
  };

  const handleSetTimeScale = (timeScale: TimeScale) => {
    setTimeScale(timeScale);

    const start = timeRange[0].clone().startOf(timeScale);
    const end = start.clone().endOf(timeScale);

    setTimeRange([start, end]);
  };

  useEffect(() => {
    setData(getData());
  }, [timeRange]);

  //const data = [{name: "Scriptcie", beer: 33, soda: 7, food: 17}];
  const interpolate = {data};

  return (
    <div className="d-flex flex-column h-100">
      <div>
        <button
          onClick={() => {
            setData(getData());
          }}
          style={{display: "none"}}
        >
          Refresh
        </button>
        <div className="d-flex gap-3" style={{gap: "1rem"}}>
          <button className="tile button" onClick={previous}>
            Previous {timeScale}
          </button>
          <div className="d-flex align-items-center">
            <span>
              {timeRange[0].format("dd DD-MM-YYYY")} -{" "}
              {timeRange[1].format("dd DD-MM-YYYY")}
            </span>
          </div>
          <select
            className="px-3"
            onChange={(e) => {
              handleSetTimeScale(e.currentTarget.value as TimeScale);
            }}
            value={timeScale}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          <button className="tile button" onClick={next}>
            Next {timeScale}
          </button>
        </div>
      </div>
      <div className="h-100 w-100 flex-grow-1">
        <BarExample width={100} height={100} data={data} />
      </div>
    </div>
  );
}
