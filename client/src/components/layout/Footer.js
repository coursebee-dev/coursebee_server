import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from 'styled-components';
import logo from '../../images/logo.png';

const LinkStyled = styled(Link)`
	color: black;
	:hover {
		color: #ef6c00;
	}
`

class Footer extends Component {
    render() {
        return (
            <div>
                <footer className="page-footer white z-depth-4">
                    <div className="container" style={{ width: "600px", justifyContent: "center" }}>
                        <ul className="row">
                            <li className="col s12 m6 l2"><LinkStyled to="/about">About</LinkStyled></li>
                            <li className="col s12 m6 l2"><LinkStyled to="#" title="Contact">Contact</LinkStyled></li>
                            <li className="col s12 m6 l2"><LinkStyled to="#" title="Daftar Isi">Sitemap</LinkStyled></li>
                            <li className="col s12 m6 l2"><LinkStyled to="#">Privacy</LinkStyled></li>
                            <li className="col s12 m6 l2"><LinkStyled to="#">Terms</LinkStyled></li>
                            {this.props.auth.isAuthenticated ? null : <li className="col s12 m6 l2"><LinkStyled to="/admin">Admin</LinkStyled></li>}
                            {this.props.auth.isAuthenticated ? <li className="col s12 m6 l2"><LinkStyled to="#">Settings</LinkStyled></li> : null}
                        </ul>
                    </div>

                    <div className="footer-copyright">
                        <div className="container">
                            <LinkStyled to="/" ><img style={{ height: "60px" }} src={logo} alt="COURSEBEE" /></LinkStyled>
                            <div style={{ lineHeight: "60px" }} className="right black-text">© Kernel Foundation</div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}
Footer.propTypes = {
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(
    mapStateToProps,
)(Footer);