import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class HomePage extends React.Component {
  render() {
    if (this.props.auth.isAuthenticated) this.props.history.push("/events");
    return (
      <div className="jumbotron">
        <h2>Mongo Events Home Page!</h2>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}
export default connect(mapStateToProps)(withRouter(HomePage));
