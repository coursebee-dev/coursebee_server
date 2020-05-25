import React, { Component } from 'react'
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class UserIcon extends Component {
    render() {
        return (
            <div>
                <Link to="#" className="btn-floating btn-large waves-effect waves-light orange darken-1">
                    <b style={{textAlign: "center", fontSize: "150%",textJustify:"center"}}>
                        {this.props.auth.user.name.charAt(0).toUpperCase()}
                    </b>
                </Link>
            </div>
        )
    }
}

UserIcon.propTypes = {
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(
    mapStateToProps
)(UserIcon);
