import React from 'react';
import { Layout } from './../Layout/Layout';
import { AppContent } from './AppContent';
import 'bootstrap/dist/css/bootstrap.css';
import './FontAwesome';

const App = props => (
  <Layout {...props}>
    <AppContent />
  </Layout>
);

export default App;
