// takes in a past timestamp and returns "x units of time ago"
const convertTimeToRelative = (timestamp) => {

  const timeOrder = ["year", "month", "day", "hour", "minute", "second"];

  const msTime = {
    year: 1000 * 60 * 60 * 24 * 31 * 365, // approximate
    month: 1000 * 60 * 60 * 24 * 31, // approximate
    day: 1000 * 60 * 60 * 24,
    hour: 1000 * 60 * 60, 
    minute: 1000 * 60, 
    second: 1000,
  };

  // Time difference
  const tweetTimeElapsed = new Date() - timestamp;
  
  //loop through key names of timeOrder and the first inequality will be returned as relative time difference
    for (let time of timeOrder) {
      if (tweetTimeElapsed >= msTime[time]) {
        let howManyUnitsOfTime = tweetTimeElapsed / msTime[time];
        let plural = Math.floor(howManyUnitsOfTime) === 1 ? "" : "s";
        return `${Math.floor(howManyUnitsOfTime)} ${time += plural} ago`;
      }
    }
  // If elapsed time is less than a second return this...
  return `Just a moment ago.`;
};