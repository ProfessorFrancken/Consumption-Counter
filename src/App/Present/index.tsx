import React, {Component} from "react";
import {connect} from "react-redux";
import Members from "./../Members/Members";
import {selectMember} from "../../actions";
import nedap from "./../../assets/nedap-logo.png";
const names = [{francken_id: "1403", name: "Mark", buixieval: "pink", screen: true}];
type PresentState = any;
class Present extends Component<{}, PresentState> {
  constructor(props: {}) {
    super(props);
    this.state = {members: []};
    this.fetchMembers = this.fetchMembers.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.fetchMembers();
  }
  fetchMembers() {
    fetch(`https://borrelcie.vodka/present/data.php`)
      .then(this.handleResponse)
      .then(
        (members) => this.setState({members}),
        (error) => this.setState({members: []})
      );
  }
  handleResponse(response: any) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response.json();
  }
  render() {
    const filteredMembers = this.state.members
      .map((memberName: any) => {
        return names.find((name) => name.name === memberName);
      })
      .filter((member: any) => member !== undefined)
      .map((presentMember: any) => {
        return (this.props as any).members.find(
          (member: any) => member.id === parseInt(presentMember.francken_id, 10)
        );
      })
      .filter((member: any) => member !== undefined);
    const selectMember = (this.props as any).selectMember;
    return (
      <div className="d-flex flex-column justify-content-between h-100">
        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ members: any; selectMember: any; }' is not... Remove this comment to see the full error message */}
        <Members members={filteredMembers} selectMember={selectMember} />
        <div className="text-right">
          Sponsored by
          <img
            src={nedap}
            className="ml-3 img-fluid"
            alt="Logo of Nedap"
            style={{width: "150px"}}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({
  members: state.members,
});
const mapDispatchToProps = (dispatch: any) => ({
  selectMember: (member: any) => dispatch(selectMember(member)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Present);
