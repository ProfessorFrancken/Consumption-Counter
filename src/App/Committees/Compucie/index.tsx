import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectMember, chwazi, fetchInitialData} from "actions";
import {compucieSelector} from "./../selectors";
import Compucie from "./Compucie";

export default () => {
  const dispatch = useDispatch();
  const {compucie, scriptcie} = useSelector(compucieSelector);

  return (
    <Compucie
      compucie={compucie}
      scriptcie={scriptcie}
      selectMember={(member: any) => dispatch(selectMember(member))}
      decreaseTempleCount={() => dispatch(chwazi())}
      reloadApplication={() => dispatch(fetchInitialData())}
    />
  );
};
