import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import HeaderImg from "../layout/HeaderImg"

class Landing extends Component {
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      if(this.props.auth.user.type === "student"){
        this.props.history.push("/dashboard");
      } else if (this.props.auth.user.type === "mentor"){
        this.props.history.push("mentor/dashboard");
      }
      else if (this.props.auth.user.type === "admin"){
        this.props.history.push("admin/dashboard");
      }
    }
  }
  render() {
    return (
      <div>
        <HeaderImg/>
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Mentor</b> Login Page
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Create a (minimal) full-stack app with user authentication via
              passport and JWTs
            </p>
            <br />
            <div style={{display:"flex", justifyContent:"space-evenly"}}className="container">
            <div>
              <Link to="/mentor/register" style={{ width: "140px",borderRadius: "3px",letterSpacing: "1.5px" }} className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                Register
              </Link>
            </div>
            <div>
              <Link to="/mentor/login" style={{ width: "140px",borderRadius: "3px",letterSpacing: "1.5px" }} className="btn btn-large btn-flat waves-effect teal black-text">
                Log In
              </Link>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(
  mapStateToProps
)(Landing);