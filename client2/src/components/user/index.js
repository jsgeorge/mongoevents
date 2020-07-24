import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUser } from "../../actions/userActions";

class UserPage  extends Component {

  componentDidMount() {
    const uid = this.props.user.id;
    console.log('uid', uid);
    this.props.getUser(uid);
  }

  render() {
    console.log('curuser', this.props.curuser);
    const { email, timezone, defaultCity } = this.props.curuser;

     return (
      <div className="user-wrapper">
          <h3>User Account Profile</h3>
           <p><strong>Email</strong> {email} <br/>
           <strong>Timezone</strong> {timezone} <br/>
           <strong>DefaultCity</strong> {defaultCity} </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    auth: state.auth,
    user: state.auth.user,
    curuser: state.curuser
  };
}

export default connect(mapStateToProps, {
  getUser
})(withRouter(UserPage));
