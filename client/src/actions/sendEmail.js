import axios from "axios";

const sendEmail = (userData) => () =>{
    axios
        .get("email/send", {params:userData})
        .then(res => {
            console.log(res.data)
        }) 
        .catch(err =>{
            console.log(err)
        });
}

export default sendEmail;