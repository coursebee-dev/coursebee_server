import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import HeaderImg from "../layout/HeaderImg"
class Landing extends Component {
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      if (this.props.auth.user.type === "student") {
        this.props.history.push("/dashboard");
      } else if (this.props.auth.user.type === "mentor") {
        this.props.history.push("mentor/dashboard");
      }
      else if (this.props.auth.user.type === "admin") {
        this.props.history.push("admin/dashboard");
      }
    }
  }
  render() {
    return (
      <div>
        <HeaderImg />
        <div>
          <div className="center-align">
            <h4>
              Greetings from<b> COURSEBEE</b>
            </h4>
            <div className="container">Coursebee is online education platform where we disseminate contemporary knowledge through live classroom , training and video based courses.</div>
            <br />
            <div className="container">Coursebee একটি অনলাইন শিক্ষামূলক প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য হল একটি ইউনিফাইড প্ল্যাটফর্মে শিক্ষার্থী এবং প্রফেশনালদের একত্রিত করা।</div>
            <h4>
              Admin Login
            </h4>
            <br />
            <div style={{ maxWidth: "600px", display: "flex", justifyContent: "space-evenly" }} className="container">
              <div>
                <Link to="/admin/register" style={{ margin: "10px", width: "140px", borderRadius: "3px", letterSpacing: "1.5px" }} className="btn btn-large waves-effect waves-light hoverable orange darken-1  black-text">
                  Register
              </Link>
              </div>
              <div>
                <Link to="/admin/login" style={{ margin: "10px", width: "140px", borderRadius: "3px", letterSpacing: "1.5px" }} className="btn btn-large waves-effect hoverable teal darken-1">
                  Log In
              </Link>
              </div>
            </div>
            <div style={{ marginTop: "50px", marginBottom: "50px" }} className="container">
              <br />
              <h4>
                About<b> COURSEBEE</b>
              </h4>
              <div>Coursebee একটি অনলাইন শিক্ষামূলক প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য হল একটি ইউনিফাইড প্ল্যাটফর্মে শিক্ষার্থী এবং প্রফেশনালদের একত্রিত করা।শিক্ষার্থীরা প্রায়শই বিভিন্ন সমস্যায় আটকে যায় যা তারা সবসময় নিজেরা সামলাতে পারে না। যথাযথ গাইড্লাইন না পেয়ে, তারা অনেক সময় ভুল সিদ্ধান্ত নেয় যা তারা ভবিষ্যতে অনুশোচনা করে।
                <br /><br />Coursebee এমন একটি প্ল্যাটফর্ম যেখানে তারা প্রফেশনালদের কাছ থেকে পরামর্শ নিতে পারবে এবং তাদের অভিজ্ঞতা share করতে পারবে।
              এখানে, গ্রুপের সদস্যরা তাদের ক্রিয়েটিভ চিন্তাভাবনা, প্রতিদিনের সমস্যাগুলি, ক্যারিয়ার পরামর্শ, নির্দেশিকা ইত্যাদি share করবে, যা অন্যান্য সদস্যদের সহায়তা করবে। বীজগণিত, ফ্লুইড মেকানিক্স,অ্যাকাউন্টিং, ফটোগ্রাফি, কোডিং, অর্থনীতি, সাহিত্য সহ সবকিছু এই প্ল্যাটফর্মের আওতায় আসবে।
              এই গ্রুপে আমরা বিভিন্ন বিষয়ে লাইভ সেশন এবং ওয়েবিনারের ব্যবস্থা করব যেখানে শিক্ষার্থীরা পেশাদারদের এবং বিশেষজ্ঞদের সাথে লাইভ ইনটারেকশন করতে পারে। এই কমিউনিটির মাধ্যমে Coursebee হবে বাংলাদেশের বৃহত্তম অনলাইন শিক্ষামূলক প্ল্যাটফর্মে।
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