import { connect } from 'react-redux'
import App from './App'

const mapStateToProps = state => state

const AppContainer = connect(mapStateToProps)(App)

export default AppContainer
