import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {chwazi, fetchInitialData} from "actions";
import {compucieSelector} from "./../selectors";
import Compucie from "./Compucie";
import {useProductPurchase} from "App/Products/Context";

const CompucieScreen = () => {
  const dispatch = useDispatch();
  const {compucie, scriptcie} = useSelector(compucieSelector);
  const {selectMember} = useProductPurchase();

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
