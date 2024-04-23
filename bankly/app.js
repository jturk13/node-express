const express = require('express');
const app = express();
const ExpressError = require("./helpers/expressError");

app.use(express.json());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

/** 404 handler: Should be after all other routes and middleware */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** General error handler */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.json({
    status: err.status,
    message: err.message
  });
});

/** Convert 24h time to words */
function timeToWords(time) {
  const hours = [
    "midnight", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "noon"
  ];
  
  const tens = [
    "", "ten", "twenty", "thirty", "forty", "fifty"
  ];
  
  const ones = [
    "oh", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"
  ];
  
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  
  let result = "";
  
  if (hour === 0 && minute === 0) {
    result = "midnight";
  } else if (hour === 12 && minute === 0) {
    result = "noon";
  } else {
    const period = hour < 12 ? "am" : "pm";
    const hour12 = hour === 0 || hour === 12 ? 12 : hour % 12;
    
    if (hour12 === 0) {
      result += hours[hour12];
    } else {
      result += `${hours[hour12]} ${hour12 === 12 ? period : ""}`;
    }
    
    if (minute !== 0) {
      result += ` ${tens[Math.floor(minute / 10)] || ones[Math.floor(minute / 10)]} ${minute % 10 !== 0 ? ones[minute % 10] : ""}`;
    }
    
    if (period === "am") {
      result += " am";
    } else {
      result += " pm";
    }
  }
  
  return result.trim();
}

module.exports = { app, timeToWords };
