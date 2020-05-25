import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import HeaderImg from "../layout/HeaderImg"

class Landing extends Component {
  componentDidMount() {
    // If logged in and user navigates to Landing page, should redirect them to dashboard
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
        <div>
          <div className="center-align">
            <h4>
              Welcome to<b> COURSEBEE</b> a platform to learn from the
              <b> Best</b>
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Create an account now
            </p>
            <br />
            <div style={{display:"flex", justifyContent:"space-evenly"}}className="container">
            <div>
              <Link to="/register" style={{ width: "140px",borderRadius: "3px",letterSpacing: "1.5px" }} className="btn btn-large waves-effect waves-light hoverable orange darken-1  black-text">
                Register
              </Link>
            </div>
            <div>
              <Link to="/login" style={{ width: "140px",borderRadius: "3px",letterSpacing: "1.5px" }} className="btn btn-large waves-effect hoverable teal darken-1">
                Log In
              </Link>
            </div>
            </div>
            <div style={{marginTop:"50px",marginBottom:"50px"}} className="container">Coursebee is online education platform where we disseminate 
              <br/>contemporary knowledge through live classroom , training 
              <br/>and video based courses.
              <br/><br/><br/>Coursebee একটি অনলাইন শিক্ষামূলক প্ল্যাটফর্ম। 
              <br/>আমাদের মূল লক্ষ্য হল একটি ইউনিফাইড প্ল্যাটফর্মে শিক্ষার্থী এবং প্রফেশনালদের একত্রিত করা।</div>
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