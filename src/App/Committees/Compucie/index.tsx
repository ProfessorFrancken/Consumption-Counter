import React from "react";
import Compucie from "./Compucie";
import {useOrder} from "App/Products/OrdersContext";
import {useHistory} from "react-router";
import {useCompucie} from "../CommitteesContext";
import {useQueryClient} from "react-query";

const CompucieScreen = () => {
  const {compucie, scriptcie} = useCompucie();
  const {selectMember} = useOrder();
  const {push} = useHistory();
  const client = useQueryClient();

  return (
    <Compucie
      compucie={compucie}
      scriptcie={scriptcie}
      selectMember={selectMember}
      reloadApplication={() => {
        client.invalidateQueries();
        client.refetchQueries();
        push("/loading");
      }}
    />
  );
};

export default CompucieScreen;
