import axios from "axios";
import qs from "querystring";
import {
    GET_ERRORS,
} from "./types";

const sendEmail = (userData,history) => dispatch =>{
    axios
        .post("/sendEmail", qs.stringify(userData))
        .then(res => {
            console.log(res.data)
        }) // re-direct to email verification on successful register
        .catch(err =>{
            console.log(err)
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })}
        );
}

export default sendEmail;