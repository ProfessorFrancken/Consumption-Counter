import React from "react";
import Compucie from "./Compucie";
import {useOrder} from "App/Products/OrdersContext";
import {useCompucie} from "../CommitteesContext";
import {useQueryClient} from '@tanstack/react-query';
import {useNavigate} from "react-router";

const CompucieScreen = () => {
  const {compucie, scriptcie} = useCompucie();
  const {selectMember} = useOrder();
  const navigate = useNavigate();
  const client = useQueryClient();

  return (
    <Compucie
      compucie={compucie}
      scriptcie={scriptcie}
      selectMember={selectMember}
      reloadApplication={() => {
        client.invalidateQueries();
        client.refetchQueries();
        navigate("/loading");
      }}
    />
  );
};

export default CompucieScreen;
