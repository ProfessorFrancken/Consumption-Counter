import Compucie from "./Compucie";
import {useCompucie} from "../CommitteesContext";
import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router";
import {useSelectMember} from "App/Products/OrdersContext";

const CompucieScreen = () => {
  const {compucie, scriptcie} = useCompucie();
  const selectMember = useSelectMember();
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
