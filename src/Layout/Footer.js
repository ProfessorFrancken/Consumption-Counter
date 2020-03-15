import React from 'react';
import BuyAll from './../App/Buttons/BuyAll';
import GoBack from './../App/Buttons/GoBack';
import CancelOrder from './../App/Buttons/CancelOrder';
import Sponsors from './../App/Sponsors';
import styled from 'styled-components';

const FooterActions = styled.div`
  display: flex;
`;

const FooterContainer = styled.div`
  padding-left: 110px;
  display: flex;
  justify-content: space-between;
  background-color: var(--sidebar-primary);
  line-height: var(--footerSize);
`;

const Footer = () => (
  <FooterContainer className="footer">
    <Sponsors />
    <FooterActions>
      <CancelOrder />
      <BuyAll />
      <GoBack />
    </FooterActions>
  </FooterContainer>
);

export default Footer;
