import {queryOptions, useQuery} from "@tanstack/react-query";
import api from "../api";
import moment from "moment";

export type Activity = {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
};

export const activitiesQueryOptions = ({
  after,
  before,
}: {
  after: string;
  before: string;
}) => {
  return queryOptions({
    queryKey: ["activities", after, before],
    queryFn: async () => {
      const response = await api.get<{
        activities: Array<{
          title: string;
          description: string;
          location: string;
          startDate: string;
          endDate: string;
        }>;
      }>("/statistics/activities", {
        after,
        before,
      });

      return response.activities.map((activity): Activity => {
        return {
          ...activity,
          startDate: moment(activity.startDate).format("YYYY-MM-DD"),
          endDate: moment(activity.endDate).format("YYYY-MM-DD"),
        };
      });
    },
    staleTime: Infinity,
  });
};

export const useActivities = () => {
  // Select activities in the past 2 years as well as any future activites for the next year
  const after = moment().subtract(2, "years").format("YYYY-MM-DD");
  const before = moment().add(1, "years").format("YYYY-MM-DD");

  const activitiesQuery = useQuery(activitiesQueryOptions({after, before}));
  const activities: Activity[] = activitiesQuery.data ?? [];

  return {activities, activitiesQuery};
};
