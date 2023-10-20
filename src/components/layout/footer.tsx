import BuyAll from "./buttons/buy-all";
import GoBack from "./buttons/go-back";
import CancelOrder from "./buttons/cancel-order";
import Sponsors from "./sponsors";
import styled from "styled-components";

const FooterActions = styled.div`
  display: flex;
`;

const FooterContainer = styled.footer`
  padding-left: 110px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-column-gap: 2rem;

  justify-content: space-between;
  background-color: var(--sidebar-primary);
  line-height: var(--footerSize);
`;

const Footer = () => (
  <FooterContainer className="footer gap-x-3">
    <Sponsors />
    <FooterActions>
      <CancelOrder />
      <BuyAll />
      <GoBack />
    </FooterActions>
  </FooterContainer>
);

export default Footer;
