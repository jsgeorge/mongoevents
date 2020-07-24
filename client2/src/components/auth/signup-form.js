import React from "react";
import { withRouter } from "react-router-dom";
import states from "../../data/states";
import timezones from "../../data/timezones";
import map from "lodash/map";
import classnames from "classnames";
//import validateInput from "../../../server/shared/validations/signup";
import TextFieldGroup from "../common/TextFieldGroup";
//import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Signup } from "../../actions/authActions";

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: "",
      password: "",
      password2: "",
      username: "",
      timezone: "",
      defaultCity: "",
      errors: {},
      isLoading: false,
      invalid: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    //this.checkUserExists = this.checkUserExists.bind(this);
  }

  componentDidMount() {}
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  isValid() {
    let errors = {};
    const {
      identifier,
      password,
      password2,
      timezone,
      defaultCity,
      username,
    } = this.state;
    if (!identifier) {
      errors.identifier = "Missing/invalid email";
    }
    if (!password) {
      errors.password = "Missing/invalid passworrd";
    }
    if (!password2) {
      errors.password2 = "Missing/invalid passworrd2";
    }
    if (password2 != password) {
      errors.password2 = "password should match";
    }
    if (!defaultCity) {
      errors.defaultCity = "Missing/invalid default city";
    }
    if (!timezone) {
      errors.timezone = "Missing/invalid default timezone";
    }
    // if (errors) {
    this.setState({ errors });
    //   return false;
    // }
    // return true;
    const isValid = Object.keys(errors).length === 0;
    return isValid;
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.Signup(this.state).then(
        (res) => this.props.history.push("/signin"),
        (err) => this.setState({ errors: err.response.data, isLoading: false })
      );
    }
  }

  render() {
    const { errors } = this.state;
    const zones = map(timezones, (val, key) => (
      <option key={val} value={val}>
        {" "}
        {key}
      </option>
    ));

    return (
      <form onSubmit={this.onSubmit}>
        <h2>Signup</h2>
        {this.props.error ? (
          <div className="alert alert-danger">{this.props.error}</div>
        ) : null}
        <TextFieldGroup
          error={errors.identifier}
          label="Email"
          onChange={this.onChange}
          //checkUserExists={this.checkUserExists}
          type="email"
          value={this.state.identifier}
          field="identifier"
        />

        <TextFieldGroup
          error={errors.password}
          label="Password"
          onChange={this.onChange}
          value={this.state.password}
          type="passowrd"
          field="password"
          type="password"
        />

        <TextFieldGroup
          error={errors.password2}
          label="Password Confirmation"
          onChange={this.onChange}
          value={this.state.password2}
          field="password2"
          type="password"
        />

        <TextFieldGroup
          error={errors.username}
          label="Username"
          onChange={this.onChange}
          //checkUserExists={this.checkUserExists}
          value={this.state.username}
          field="username"
        />

        <TextFieldGroup
          error={errors.defaultCity}
          label="Default City"
          onChange={this.onChange}
          //checkUserExists={this.checkUserExists}
          value={this.state.defaultCity}
          field="defaultCity"
        />

        <div
          className={classnames("form-group", { "has-error": errors.timezone })}
        >
          <label className="control-label">Timezone</label>
          <select
            className="form-control"
            onChange={this.onChange}
            value={this.state.timezone}
            name="timezone"
          >
            <option value="" disabled>
              Choose Your Timezone
            </option>
            {zones}
          </select>
          {errors.timezone && (
            <span className="help-block">{errors.timezone}</span>
          )}
        </div>
        <div className="form-group">
          <button
            disabled={this.state.isLoading || this.state.invalid}
            className="btn btn-primary btn-lg"
          >
            Sign up
          </button>
        </div>
      </form>
    );
  }
}

//SignupForm.propTypes = {
// userSignupRequest: React.PropTypes.func.isRequired
//addFlashMessage: React.PropTypes.func.isRequired,
//isUserExists: React.PropTypes.func.isRequired
//};

// SignupForm.contextTypes = {
//   router: React.PropTypes.object.isRequired
// };
function mapStateToProps(state) {
  return { error: state.auth.error };
}
export default connect(mapStateToProps, { Signup })(withRouter(SignupForm));
