import Members from "App/Members/Members";
import {useParams} from "react-router";
import {useSelectMember} from "App/Products/OrdersContext";
import {useGroupedSurnames} from "App/Members/Context";

const SelectMemberFromSurnameRangeScreen = () => {
  const params = useParams<{page: string | undefined}>();
  const groupedSurnames = useGroupedSurnames();
  const {members} =
    params.page !== undefined
      ? groupedSurnames[parseInt(params.page, 10)]
      : {members: []};
  const selectMember = useSelectMember();

  return <Members members={members} selectMember={selectMember} />;
};

export default SelectMemberFromSurnameRangeScreen;
