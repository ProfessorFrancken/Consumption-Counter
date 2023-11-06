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
} from "@visx/scale";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import {GridRows, GridColumns} from "@visx/grid";
import {useCommittees} from "queries/committees";
import moment, {Moment} from "moment";

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

  const ySubScale = useMemo(() => {
    const purchaseTotals = data.map((committee) => {
      return committee.beer + committee.food + committee.soda;
    });

    return scaleLinear<number>({
      domain: [0, Math.max(...purchaseTotals)],
      range: [yMax, 0],
    });
  }, [data, yMax]);

  const colorScale = useMemo(
    () => scaleOrdinal({domain: keys, range: ["#6c757d", "red", "green"]}),
    [keys]
  );

  const subGridTicks = getTicks(yScale, 3 * 10);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={"#fafaba"}
        fillOpacity={0.1}
      />
      <Group left={margin.left} top={margin.right}>
        <rect
          x={0}
          y={0}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
          fill={"#bafaba"}
          fillOpacity={0.1}
        />
        <GridRows
          scale={yScale}
          width={xMax}
          height={yMax}
          stroke="#eee"
          tickValues={subGridTicks}
        />
        <GridRows scale={yScale} width={xMax} height={yMax} stroke="#e0e0e0" />

        <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
        <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
          Temperature (°F)
        </text>

        <Group>
          <BarStack<CommitteeData, Field>
            data={data}
            keys={["beer", "food", "soda"]}
            x={(committeee) => committeee.name}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) => {
              return barStacks.map((barStack) => {
                return barStack.bars.map((bar) => {
                  //const barHeight = (yScale(y0(bar)) || 0) - (yScale(y1(bar)) || 0);
                  return (
                    <rect
                      key={`bar-stack-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      //fill={"#6c757d"}
                      fill={bar.color}
                    />
                  );
                });
              });
            }}
          </BarStack>

          <AxisBottom
            top={yMax}
            scale={xScale}
            tickLabelProps={{
              fontSize: 11,
              textAnchor: "middle",
              color: "#6c757d",
              fill: "rgb(108, 117, 125)",
            }}
            numTicks={data.length}
            tickComponent={(props) => {
              const tickLabelSize = 10;
              const tickRotate = -45;
              const tickColor = "#8e205f";
              const tick = props;
              const tickX = tick.x;
              const tickY = tick.y + 20; //+ tickLabelSize + props.tickLength;

              return (
                <text
                  transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
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
          <AxisLeft
            scale={yScale}
            tickLabelProps={{
              fontSize: 10,
              textAnchor: "middle",
              color: "#6c757d",
              fill: "rgb(108, 117, 125)",
            }}
          />
        </Group>
      </Group>
    </svg>
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
          >
            <option value="day" selected={timeScale === "day"}>
              Day
            </option>
            <option value="week" selected={timeScale === "week"}>
              Week
            </option>
            <option value="month" selected={timeScale === "month"}>
              Month
            </option>
            <option value="year" selected={timeScale === "year"}>
              Year
            </option>
          </select>
          <button className="tile button" onClick={next}>
            Next {timeScale}
          </button>
        </div>
      </div>
      <div className="h-100 w-100 flex-grow-1">
        <ParentSize debounceTime={10}>
          {({width, height}) => <BarExample width={width} height={height} data={data} />}
        </ParentSize>
      </div>
    </div>
  );
}
