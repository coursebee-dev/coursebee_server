import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import setCurrentUser from "./actions/setUser";
import logoutUser from "./actions/logoutAction";

import { Provider } from "react-redux";
import store from "./store";
import axios from "axios";


import Navbar from "./components/layout/Navbar";
import Landing from "./components/landing/Landing";
import LandingMentor from "./components/landingMentor/LandingMentor";
import LandingAdmin from "./components/landingAdmin/LandingAdmin";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import RegisterMentor from "./components/authMentor/RegisterMentor";
import LoginMentor from "./components/authMentor/LoginMentor";
import RegisterAdmin from "./components/authAdmin/RegisterAdmin";
import LoginAdmin from "./components/authAdmin/LoginAdmin";
import VerifyEmail from "./components/verifyEmail/VerifyEmail"
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardMentor from "./components/dashboardMentor/DashboardMentor";
import DashboardAdmin from "./components/dashboardAdmin/DashboardAdmin";
import Footer from "./components/layout/Footer";
import About from "./components/about/About";

//axios.defaults.baseURL="http://localhost:5000"
axios.defaults.baseURL = "https://coursebee-app-passport.herokuapp.com"
// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to home
    window.location.href = "./";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <div className="App">
              <Navbar />
              <Route exact path="/" component={Landing} />
              <Route exact path="/mentor" component={LandingMentor} />
              <Route exact path="/admin" component={LandingAdmin} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/mentor/register" component={RegisterMentor} />
              <Route exact path="/mentor/login" component={LoginMentor} />
              <Route exact path="/admin/register" component={RegisterAdmin} />
              <Route exact path="/admin/login" component={LoginAdmin} />
              <Route exact path="/verifyEmail" component={VerifyEmail} />
              <Route exact path="/about" component={About} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/mentor/dashboard" component={DashboardMentor} />
              <PrivateRoute exact path="/admin/dashboard" component={DashboardAdmin} />
              <Footer />
            </div>
          </Switch>
        </Router>
      </Provider>
    );
  }
}
export default App;