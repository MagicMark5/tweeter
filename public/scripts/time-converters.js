// corrects 11 minute lag in day change for UTC near midnight.
const correctDay = (day, hours, minutes) => {
  if (hours === 23 && minutes >= 49) {
    return day - 1;
  }
  return day;
}

// Returns an object with number values for date properties on the date object
const getTimeData = (date) => {  
  const timeData = {
    year: date.getFullYear(), 
    month: date.getMonth() + 1, 
    hour: date.getHours(), 
    minute: date.getMinutes(), 
    second: date.getSeconds(), 
    day: correctDay(date.getUTCDate(), date.getHours(), date.getMinutes())
  };

  return timeData; 
}; 


// takes in a past timestamp and returns "x units of time ago"
const convertTimeToRelative = (timestamp) => {

  const timeOrder = ["year", "month", "day", "hour", "minute", "second"];

  const now = getTimeData(new Date(Date.now()));
  const timeOfTweet = getTimeData(new Date(timestamp));
  // adjust for time error (11 is a magic number)
  timeOfTweet.minute += 11;
  timeOfTweet.second += 11;

  // loop through key names of timeOrder and the first inequality will be returned as relative time difference
    for (let time of timeOrder) {
      if (now[time] !== timeOfTweet[time]) {
        let plural = now[time] - timeOfTweet[time] === 1 ? "" : "s";
        return `${now[time] - timeOfTweet[time]} ${time += plural} ago`;
      }
    }
  return `Just a moment ago.`;
};