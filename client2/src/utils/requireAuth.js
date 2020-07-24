import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
export default function (ComposedComponent) {
  class Authenticate extends Component {
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        console.log("must be logged in");
        this.props.history.push("/signin");
      }
    }
    componentWillUpdate(nextProps) {
      console.log(nextProps.isAuthenticated);
      if (!nextProps.isAuthenticated) {
        this.props.history.push("/");
      }
    }
    render() {
      return <ComposedComponent {...this.props} />;
    }
  }
  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated,
    };
  }

  return connect(mapStateToProps)(withRouter(Authenticate));
}
