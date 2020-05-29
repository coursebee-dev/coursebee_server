const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};// Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";// Name checks
  data.mobileNo = !isEmpty(data.mobileNo) ? data.mobileNo : "";
  data.organization = !isEmpty(data.organization) ? data.organization : "";
  data.position = !isEmpty(data.position ) ? data.position  : "";
  data.location = !isEmpty(data.location) ? data.location: "";
  data.adminKey = !isEmpty(data.adminKey) ? data.adminKey: "";
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  if (Validator.isEmpty(data.mobileNo)) {
    errors.mobileNo = "Mobile number field is required";
  }
  if (!/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/.test(data.mobileNo)) {
    errors.mobileNo = "Mobile number is invalid";
  }
  if (Validator.isEmpty(data.organization)) {
    errors.organization = "Organization field is required";
  }
  if (Validator.isEmpty(data.position)) {
    errors.position = "Postion field is required";
  }
  if (Validator.isEmpty(data.location)) {
    errors.location = "Location field is required";
  }
  if (!Validator.equals(data.adminKey, process.env.adminKey)) {
    errors.adminKey = "Wrong admin key";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};