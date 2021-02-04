import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {chwazi, fetchInitialData} from "actions";
import {compucieSelector} from "./../selectors";
import Compucie from "./Compucie";
import {useOrder} from "App/Products/OrdersContext";

const CompucieScreen = () => {
  const dispatch = useDispatch();
  const {compucie, scriptcie} = useSelector(compucieSelector);
  const {selectMember} = useOrder();

  return (
    <Compucie
      compucie={compucie}
      scriptcie={scriptcie}
      selectMember={selectMember}
      decreaseTempleCount={() => dispatch(chwazi())}
      reloadApplication={() => dispatch(fetchInitialData())}
    />
  );
};

export default CompucieScreen;
