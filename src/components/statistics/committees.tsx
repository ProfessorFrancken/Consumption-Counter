import {Suspense, useCallback, useEffect, useMemo, useState} from "react";
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
  Axis,
  AnimatedGrid,
  Tooltip,
} from "@visx/xychart";
import {LegendThreshold, LegendOrdinal} from "@visx/legend";
import {useSearchParams} from "react-router-dom";
import {useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import api from "api";

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

const defaultMargin = {top: 40, right: 80, bottom: 40, left: 40};

const keys = ["beer", "food", "soda"];

const tickLabelProps = {
  fontSize: 10,
  textAnchor: "middle",
  color: "#6c757d",
  fill: "rgb(108, 117, 125)",
} as const;
// https://medium.com/vx-code/getting-started-with-vx-1756bb661410

export type BarStackProps = {
  margin?: {top: number; right: number; bottom: number; left: number};
  events?: boolean;
  timeRange: [Moment, Moment];
};
function CommitteesStatisticsForTimeRange({
  timeRange,
  margin: old = defaultMargin,
}: BarStackProps) {
  const {committees} = useCommittees();
  const getData = useCallback(() => {
    return [...committees].map((c, idx) => {
      return {
        name: `Committee ${idx}`,
        beer: Math.ceil(330 * Math.random()),
        food: Math.ceil(330 * Math.random()),
        soda: Math.ceil(330 * Math.random()),
      };
    });
  }, [committees]);
  const committeeStatisticsQuery = useSuspenseQuery({
    queryKey: ["committee-statistics", timeRange, committees.length],
    queryFn: async () => {
      const response = await api.get<{
        statistics: {
          beer: number;
          food: number;
          soda: number;
          committee: {id: number; name: string};
        }[];
      }>("/statistics/committees", {
        startDate: timeRange[0].format("YYYY-MM-DD"),
        endDate: timeRange[1].format("YYYY-MM-DD"),
      });

      return response.statistics.map((stats) => {
        const committee = committees.find(({id}) => id === stats.committee.id);
        return {
          name: committee?.name ?? `${stats.committee.id}`,
          beer: stats.beer,
          food: stats.food,
          soda: stats.soda,
        };
      });
    },
  });
  const data = committeeStatisticsQuery.data;

  return (
    <div className="w-100 h-100">
      <div className="w-100 h-100">
        <XYChart
          theme={theme}
          xScale={{type: "band", padding: 0.5}}
          yScale={{type: "linear"}}
        >
          <AnimatedGrid rows={true} columns={false} />

          <AnimatedBarStack>
            <BarSeries
              dataKey="beer"
              data={data}
              xAccessor={(d) => d.name}
              yAccessor={(d) => d.beer}
            />
            <BarSeries
              dataKey="food"
              data={data}
              xAccessor={(d) => d.name}
              yAccessor={(d) => d.food}
            />
            <BarSeries
              dataKey="soda"
              data={data}
              xAccessor={(d) => d.name}
              yAccessor={(d) => d.soda}
            />
          </AnimatedBarStack>
          <AnimatedAxis
            animationTrajectory="min"
            orientation="bottom"
            tickLabelProps={tickLabelProps}
            numTicks={data.length}
            tickComponent={(props) => {
              const transform = `translate(-10, 20) rotate(-33)`;
              return (
                <text transform={transform} fontSize={10} textAnchor="middle">
                  {props.formattedValue}
                </text>
              );
            }}
          />
          <AnimatedAxis
            animationTrajectory="min"
            orientation="left"
            tickLabelProps={tickLabelProps}
            label="Consumptions"
          />
          <Tooltip<CommitteeData>
            snapTooltipToDatumX
            snapTooltipToDatumY
            renderTooltip={({tooltipData, colorScale}) => {
              if (tooltipData?.nearestDatum?.datum === undefined) {
                return null;
              }

              return (
                <>
                  dd {tooltipData?.nearestDatum?.datum.name}
                  <br />
                  <br />
                  {(["beer", "food", "soda"] as Field[]).map((category) => {
                    const amount = tooltipData?.nearestDatum?.datum[category];

                    return (
                      <div key={category}>
                        <em style={{color: colorScale?.(category)}}>{category}</em>{" "}
                        {amount}
                      </div>
                    );
                  })}
                </>
              );
            }}
          />
        </XYChart>
      </div>
    </div>
  );
}

type TimeScale = "day" | "week" | "month" | "year";

const useDateRange = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const timeScale = (searchParams.get("time-scale") ?? "week") as TimeScale;
  const setTimeScale = useCallback(
    (timeScale: TimeScale) => {
      searchParams.set("time-scale", timeScale);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const beforeSearchParam = searchParams.get("before");
  const before = useMemo(() => {
    const now = moment();
    return beforeSearchParam !== null
      ? moment(beforeSearchParam)
      : now.clone().startOf(timeScale);
  }, [beforeSearchParam, timeScale]);

  const afterSearchParam = searchParams.get("after");
  const after = useMemo(() => {
    const now = moment();
    return afterSearchParam !== null
      ? moment(afterSearchParam)
      : now.clone().endOf(timeScale);
  }, [afterSearchParam, timeScale]);

  const setTimeRange = useCallback(
    ([before, after]: [Moment, Moment]) => {
      searchParams.set("before", before.format("YYYY-MM-DD"));
      searchParams.set("after", after.format("YYYY-MM-DD"));
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  return useMemo(() => {
    const timeRange = [before, after] satisfies [Moment, Moment];
    return {timeScale, setTimeScale, timeRange, setTimeRange};
  }, [timeScale, setTimeScale, before, after, setTimeRange]);
};

export const DateRangeForm = () => {
  const {timeScale, setTimeScale, timeRange, setTimeRange} = useDateRange();

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

  return (
    <div className="d-flex gap-3 py-4 " style={{gap: "1rem"}}>
      <button className="tile button" onClick={previous}>
        Previous {timeScale}
      </button>
      <div className="d-flex align-items-center">
        {timeScale === "day" ? (
          timeRange[0].format("DD-MM-YYYY")
        ) : (
          <span>
            {timeRange[0].format("DD-MM-YYYY")} - {timeRange[1].format("DD-MM-YYYY")}
          </span>
        )}
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
  );
};

export function Committees() {
  const {timeRange} = useDateRange();

  return (
    <div className="d-flex flex-column h-100">
      <div className="h-100 w-100 flex-grow-1">
        <Suspense
          fallback={
            <div className="d-flex justify-content-center align-items-center h-100 w-100">
              <FontAwesomeIcon
                icon={"spinner"}
                spin
                size="10x"
                fixedWidth
                className="mr-1 text-muted"
              />
            </div>
          }
        >
          <CommitteesStatisticsForTimeRange timeRange={timeRange} />
        </Suspense>
      </div>
    </div>
  );
}
