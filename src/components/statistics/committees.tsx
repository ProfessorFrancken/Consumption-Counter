import {Suspense, useCallback, useMemo} from "react";
import {useCommittees} from "../../queries/committees";
import moment, {Moment} from "moment";
import {
  XYChart,
  lightTheme as theme,
  AnimatedBarStack,
  AnimatedBarSeries as BarSeries,
  AnimatedAxis,
  AnimatedGrid,
  Tooltip,
} from "@visx/xychart";
import {useSearchParams} from "react-router-dom";
import {useSuspenseQuery} from "@tanstack/react-query";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import api from "../../api";
import {DateRangePicker} from "../date-range-picker";
import {CalendarDate, parseDate} from "@internationalized/date";

const useDateRange = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const beforeSearchParam = searchParams.get("before");
  const before = useMemo(() => {
    const now = moment();
    return beforeSearchParam !== null
      ? moment(beforeSearchParam)
      : now.clone().startOf("week");
  }, [beforeSearchParam]);

  const afterSearchParam = searchParams.get("after");
  const after = useMemo(() => {
    const now = moment();
    return afterSearchParam !== null
      ? moment(afterSearchParam)
      : now.clone().endOf("week");
  }, [afterSearchParam]);

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
    return {timeRange, setTimeRange};
  }, [before, after, setTimeRange]);
};

type Field = "beer" | "soda" | "food";
type CommitteeData = {
  name: string;
  beer: number;
  soda: number;
  food: number;
};

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
function CommitteesStatisticsForTimeRange() {
  const {timeRange} = useDateRange();

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
      //return getData();
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
                  {tooltipData?.nearestDatum?.datum.name}
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

export const DateRangeForm = () => {
  const {timeRange, setTimeRange} = useDateRange();

  const value = {
    start: parseDate(timeRange[0].format("YYYY-MM-DD")),
    end: parseDate(timeRange[1].format("YYYY-MM-DD")),
  };

  const onChange = (range: {start: CalendarDate; end: CalendarDate}) => {
    setTimeRange([moment(range.start.toString()), moment(range.end.toString())]);
  };

  return (
    <div className="d-flex gap-3 py-4 " style={{gap: "1rem"}}>
      <DateRangePicker value={value} onChange={onChange} />
    </div>
  );
};

export function Committees() {
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
          <CommitteesStatisticsForTimeRange />
        </Suspense>
      </div>
    </div>
  );
}
