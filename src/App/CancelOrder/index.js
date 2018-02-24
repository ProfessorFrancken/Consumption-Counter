import React from 'react';
import { connect } from 'react-redux';
import { cancelOrder } from './../../actions';

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

const mapDispatchToProps = dispatch => {
  return {
    onClick: order => {
      return dispatch(cancelOrder(order.order, order.ordered_at));
    }
  };
};

const mapStateToProps = state => {
  return { queuedOrder: state.queuedOrder };
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelOrder);
