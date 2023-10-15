import Members from "App/Members/Members";
import {useParams} from "react-router";
import {useSelectMember} from "App/Products/OrdersContext";
import {useGroupedSurnames} from "App/Members/Context";

const useMembersFromSelectedRange = () => {
  const params = useParams<{page: string | undefined}>();
  const groupedSurnames = useGroupedSurnames();

  if (params.page === undefined) {
    return [];
  }

  const range = groupedSurnames[parseInt(params.page, 10)];

  if (range) {
    return range.members;
  }
  return [];
};

const SelectMemberFromSurnameRangeScreen = () => {
  const members = useMembersFromSelectedRange();

  const selectMember = useSelectMember();

  return <Members members={members} selectMember={selectMember} />;
};

export default SelectMemberFromSurnameRangeScreen;
