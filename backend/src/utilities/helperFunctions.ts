const createDatetime = (date: Date, time: string) => {
  let splitedTime = time.split(':');
  if (splitedTime.length === 2) {
    let datetime = new Date(date);
    datetime.setHours(parseInt(splitedTime[0]));
    datetime.setMinutes(parseInt(splitedTime[1]));
    return datetime;
  }
  return null;
};

const convertTimeToString = (datetime: Date) => {
  if (datetime) {
    let splitTime = datetime.toTimeString()
      .match(/([0-9]+:[0-9]+)/g);
    if (splitTime) {
      return splitTime[0].replace(/^0+/, '');

    }
  }
  return null;
};

const getTimeInMinutes = (datetime: Date | null) => {
  if (datetime) {
    return datetime.getHours() * 60 + datetime.getMinutes();
  }
  return 0;
};

export default {
  createDatetime,
  convertTimeToString,
  getTimeInMinutes
};
