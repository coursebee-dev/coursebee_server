import qs from "querystring";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
    GET_ERRORS,
} from "./types";
import setCurrentUser from "./setUser";

// Register User
export const registerAdmin = (userData, history) => dispatch => {
    axios
        .post("/admin/register", qs.stringify(userData))
        .then(res => history.push("/admin/login")) // re-direct to login on successful register
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


// Login - get user token
export const loginAdmin = userData => dispatch => {
    axios
        .post("/admin/login", qs.stringify(userData))
        .then(res => {
            // Save to localStorage// Set token to localStorage
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};