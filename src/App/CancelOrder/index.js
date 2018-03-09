import React from 'react';
import { connect } from 'react-redux';
import { cancelOrder } from './../../actions';
import { queuedOrderSelector } from './../../selectors';

const CancelOrder = ({ onClick, queuedOrder }) =>
  queuedOrder === null ? null : (
    <button
      className="btn btn-outline-light btn-lg"
      onClick={() => onClick(queuedOrder)}
    >
      {`Cancel ${queuedOrder.order.member.firstName} ${
        queuedOrder.order.member.surname
      }'s purchase`}
    </button>
  );

const mapDispatchToProps = dispatch => ({
  onClick: order => dispatch(cancelOrder(order.order, order.ordered_at))
});

const mapStateToProps = state => ({
  queuedOrder: queuedOrderSelector(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(CancelOrder);
