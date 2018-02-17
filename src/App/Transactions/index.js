import { connect } from 'react-redux'
import Transactions from './Transactions'

const mapStateToProps = state => {
  return {
    transactions: state.transactions
  }
}

export default connect(mapStateToProps)(Transactions)
