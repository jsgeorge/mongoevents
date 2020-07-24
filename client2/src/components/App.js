import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Header from "./layout/header";
import Routes from "../routes";
import store from "../store";
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <div className="container" id="margin-top">
            <Routes />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
