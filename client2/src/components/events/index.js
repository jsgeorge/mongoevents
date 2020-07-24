import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getEvents } from "../../actions/eventActions";
import { getSettings, chgDefaultCity } from "../../actions/settingsActions";
import { getCategories } from "../../actions/categoryActons";

import EventItem from "./item";

class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChgCity: false,
      srchStr: "",
      defaultCity: "",
      defaultState: "",
      city: "",
      state: "",
      errors: {},
      isLoading: false,
      invalid: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    if (!this.props.user) this.props.history.push("/signin");
    this.props.getCategories();
    const uid = this.props.user.id;
    console.log("uid", uid);
    this.props.getSettings(uid);
    this.props.getEvents();
  }

  onShowChgCity(e) {
    this.setState({ showChgCity: !this.state.showChgCity });
  }
  onChange(e) {
    if (!!this.state.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors[e.target.name];
      this.setState({ [e.target.name]: e.target.value, errors });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }
  isValidEntries() {
    let errors = {};
    const { srchStr } = this.state;
    if (!srchStr) {
      errors.srchStr = "Missing/invalid search term";
    }

    // if (errors) {
    this.setState({ errors });
    //   return false;
    // }
    // return true;
    const isValid = Object.keys(errors).length === 0;
    return isValid;
  }
  onSearch(e) {
    e.preventDefault();
    console.log("srchstr", this.state.srchStr);
    this.setState({ errors: {}, isLoading: true });
    let filters = {};
    filters = { srchstr: this.state.srchStr };
    this.props.getEvents(filters).then(
      (res) => console.log("search successfull"),
      (err) => this.setState({ errors: err.response.data, isLoading: false })
    );
  }
  onChgDefaultCity = () => {
    if (this.isValidEntries()) {
      const chgCity = { defaultCity: this.state.defaultCity };
      this.props.chgDefaultCity(this.props.user.id, chgCity);
      this.setState({ showChgCity: false });
      this.props.getSettings(this.props.user.id);
      this.props.getEvents();
    }
  };
  onFilterCategory = (category) => {
    let filters = { category: category };
    this.props.getEventsByCity(filters);
  };
  render() {
    const { errors } = this.state;
    console.log(this.props.settings.defaults);
    const { user, events, categories, settings } = this.props;

    return (
      <div className="events-wrapper">
        <div className="page-top-cmds">
          <form
            onSubmit={() => this.onSearch}
            className="form-inline active-cyan-4"
          >
            <input
              className="form-control form-control-sm mr-3 w-75"
              type="text"
              placeholder="Search events, venues, cities"
              aria-label="Search"
              name="srchStr"
              onChange={this.onChange}
            />
            <button className="btn btn-default btn-sm">
              <i className="fa fa-search" aria-hidden="true"></i>Q
            </button>
            {errors.form && (
              <span className="alert alert-danger">
                {this.state.errors.form}
              </span>
            )}
            {errors.name && <span className="help-block">{errors.name}</span>}
          </form>
        </div>
        <div className="page-top-cmds">
          <div className="filterCmds">
            <h6>
              {this.props.settings && this.props.settings.defaults ? (
                <span className="ctryFont">
                  {this.props.settings.defaults.defaultCity}
                </span>
              ) : (
                "No Defult City"
              )}
              <button
                style={{
                  height: "30px",
                  width: "30",
                  fontSize: "8px",
                  padding: "5px 2px",
                  fontWeight: "bold",
                  margin: "0 5px 0 0",
                  marginRignt: "60px",
                  background: "Transparent",
                }}
                className="btn btn-default"
                onClick={() => this.onShowChgCity()}
              >
                \/
              </button>

              {this.state.showChgCity ? (
                <div>
                  <input
                    name="defaultCity"
                    placeholder="change default city"
                    onChange={this.onChange}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => this.onChgDefaultCity()}
                  >
                    Submit
                  </button>
                </div>
              ) : null}

              {categories.list ? (
                <span className="ctgryBtns">
                  <button
                    className="btn btn-default btn-sm ctgryBtn"
                    onClick={() => this.onFilterCategory("")}
                  >
                    All
                  </button>
                  {this.props.categories.list.map((c) => (
                    <button
                      key={c._id}
                      className="btn btn-default btn-sm ctgryBtn"
                      onClick={() => this.onFilterCategory(c.name)}
                    >
                      {c.name}
                    </button>
                  ))}
                </span>
              ) : null}
            </h6>
          </div>
        </div>
        {/* <div className="page-top-cmds">
          <Link to="/events/new" className="btn btn-primary">
            Add Event
          </Link>
        </div> */}

        {events.list ? (
          <div>
            {this.props.events.list.map((event) => (
              <EventItem key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <p>No current events</p>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  console.log(state);
  return {
    auth: state.auth,
    user: state.auth.user,
    events: state.events,
    settings: state.settings,
    categories: state.categories,
  };
}

export default connect(mapStateToProps, {
  getEvents,
  getCategories,
  getSettings,
  chgDefaultCity,
})(withRouter(EventsPage));
