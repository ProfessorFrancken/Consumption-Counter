import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchInitialData} from "actions";
import {compucieSelector} from "./../selectors";
import Compucie from "./Compucie";
import {useOrder} from "App/Products/OrdersContext";
import {useHistory} from "react-router";

const CompucieScreen = () => {
  const dispatch = useDispatch();
  const {compucie, scriptcie} = useSelector(compucieSelector);
  const {selectMember} = useOrder();
  const {push} = useHistory();

  return (
    <Compucie
      compucie={compucie}
      scriptcie={scriptcie}
      selectMember={selectMember}
      reloadApplication={() => {
        push("/loading");
        dispatch(fetchInitialData());
      }}
    />
  );
};

export default CompucieScreen;
