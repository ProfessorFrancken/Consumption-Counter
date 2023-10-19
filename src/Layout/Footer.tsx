import BuyAll from "Layout/Buttons/BuyAll";
import GoBack from "Layout/Buttons/GoBack";
import CancelOrder from "Layout/Buttons/CancelOrder";
import Sponsors from "App/Sponsors";
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
