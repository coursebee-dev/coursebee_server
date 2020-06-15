const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLiveSchedule(data) {
  let errors = {};// Convert empty fields to an empty string so we can use validator functions
  data.topic = !isEmpty(data.topic) ? data.topic : "";
  data.start_time = !isEmpty(data.start_time.split('T')[0]) ? data.start_time : "";
  data.start_time = data.start_time.split('T')[1] !==':00' ? data.start_time : "";
  const tempDate = new Date();
  tempDate.setHours(tempDate.getHours()+8)
  const startTime = new Date(data.start_time +'Z')
  data.duration = !isEmpty(data.duration) ? data.duration : "";
  data.topic = !isEmpty(data.topic) ? data.topic : "";
  data.agenda = !isEmpty(data.agenda) ? data.agenda : "";
  if (Validator.isEmpty(data.topic)) {
    errors.topic = "Topic field is required";
  }
  if (Validator.isEmpty(data.start_time)) {
    errors.start_date = "Start Date field is required";
    errors.start_time = "Start time field is required";
  }
  if (tempDate >= startTime) {
    errors.start_date = "Schedule time at least 2 hours before";
    errors.start_time = "Schedule time at least 2 hours before";
  }
  if (Validator.isEmpty(data.duration)) {
    errors.duration = "Duration field is required";
  }
  if (data.duration <= 20) {
    errors.duration = "Class Duration should be at least 20 minutes";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.agenda)) {
    errors.agenda = "Agenda field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};