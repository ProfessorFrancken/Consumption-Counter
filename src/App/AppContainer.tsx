import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchInitialData} from "./../actions";
import {backgroundSelector, failedOrdersSelector} from "./selectors";
import {withRouter} from "react-router-dom";
import {push} from "connected-react-router";
import ScreenSaver from "./ScreenSaver";
import App from "./App";
class AppContainer extends Component {
  render() {
    return (
      <>
        <ScreenSaver
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ listen: any; goHome: any; goToScreenSaver:... Remove this comment to see the full error message
          listen={(this.props as any).history.listen}
          goHome={(this.props as any).goHome}
          goToScreenSaver={(this.props as any).goToScreenSaver}
        />
        <App {...this.props} />
      </>
    );
  }
}
const mapStateToProps = (state: any) => ({
  menuItems: state.menuItems,
  background: backgroundSelector(state),
  failedOrders: failedOrdersSelector(state),
});
const mapDispatchToProps = (dispatch: any) => ({
  fetchData: () => dispatch(fetchInitialData()),
  goToCompucieScreen: () => dispatch(push("/compucie")),
  goToProminent: () => dispatch(push("/prominent")),
  goHome: () => dispatch(push("/")),
  goToScreenSaver: () => dispatch(push("/statistics")),
});
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'ConnectedComponent<typeof AppCon... Remove this comment to see the full error message
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppContainer));
// TODO add lifecycle stuff so that we can load initial data
/* export connect(mapStateToProps)(AppContainer)*/
