import React from "react";
import {useDispatch} from "react-redux";
import {fetchInitialData} from "actions";
import Compucie from "./Compucie";
import {useOrder} from "App/Products/OrdersContext";
import {useHistory} from "react-router";
import {useCompucie} from "../CommitteesContext";

const CompucieScreen = () => {
  const dispatch = useDispatch();
  const {compucie, scriptcie} = useCompucie();
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
