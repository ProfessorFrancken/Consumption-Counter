import React from "react";
import {QueryObserverResult, useQuery} from '@tanstack/react-query';
import api from "api";
import moment from "moment";

export type Activity = {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
};

const useFetchActivities = (activities?: Activity[]) => {
  // Select activities in the past 2 years as well as any future activites for the next year
  const after = moment().subtract(2, "years").format("YYYY-MM-DD");
  const before = moment().add(1, "years").format("YYYY-MM-DD");

  return useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const mapActivity = (activity: any): Activity => {
        return {
          ...activity,
          startDate: moment(activity.startDate).format("YYYY-MM-DD"),
          endDate: moment(activity.endDate).format("YYYY-MM-DD"),
        };
      };

      const response = await api.get("/statistics/activities", {
        after,
        before,
      });

      return response.activities.map(mapActivity);
    },
    enabled: activities === undefined,
    initialData: activities,
    refetchInterval: 60 * 60 * 1000,
  });
};

type State = {
  activitiesQuery: QueryObserverResult<Activity[]>;
  activities: Activity[];
};
const ActivitiesContext = React.createContext<State | undefined>(undefined);
export const ActivitiesProvider: React.FC<{
  activities?: Activity[];
  children: React.ReactNode;
}> = ({activities: defaultActivities, children, ...props}) => {
  const activitiesQuery = useFetchActivities(defaultActivities);
  const activities: Activity[] = defaultActivities ?? activitiesQuery.data ?? [];

  return (
    <ActivitiesContext.Provider
      value={{
        activitiesQuery,
        activities,
        ...props,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = React.useContext(ActivitiesContext);

  if (!context) {
    throw new Error(`useActivities must be used within a ActivitiesContext`);
  }

  return context;
};
