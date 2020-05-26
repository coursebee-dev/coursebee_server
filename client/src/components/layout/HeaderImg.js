import React, { Component } from "react";
//import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import hexagon from '../../images/hexagon2.jpg'
class HeaderImg extends Component {
    render() {
        return (
            <div>
                <img style={{ width: "100%" }} src={hexagon} alt="header img" />
            </div>
        );
    }
}
HeaderImg.propTypes = {
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(
    mapStateToProps,
)(HeaderImg);