import {useQuery} from "@tanstack/react-query";
import api from "api";
import moment from "moment";

export type Activity = {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
};

const useActivitiesQuery = () => {
  // Select activities in the past 2 years as well as any future activites for the next year
  const after = moment().subtract(2, "years").format("YYYY-MM-DD");
  const before = moment().add(1, "years").format("YYYY-MM-DD");

  return useQuery<Activity[]>({
    queryKey: ["activities"],
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
    // TODO: figure out how to fix an issue with jest timers...?
    //refetchInterval: 60 * 60 * 1000,
  });
};

export const useActivities = () => {
  const activitiesQuery = useActivitiesQuery();
  const activities: Activity[] = activitiesQuery.data ?? [];

  return {activities, activitiesQuery};
};
