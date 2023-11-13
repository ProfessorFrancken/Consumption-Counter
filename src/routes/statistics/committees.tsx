import {styled} from "styled-components";
import {Committees} from "./../../components/statistics/committees";

const StatisticsGrid = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export const CommitteesStatistics = () => {
  return (
    <StatisticsGrid>
      <div className="h-100 w-100 flex-grow-1">
        <Committees />
      </div>
    </StatisticsGrid>
  );
};
