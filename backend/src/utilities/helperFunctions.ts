export const createDatetime = (date: Date, time: string) => {
  let splitedTime = time.split(':');
  if (splitedTime.length === 2) {
    let datetime = new Date(date);
    datetime.setHours(parseInt(splitedTime[0]));
    datetime.setMinutes(parseInt(splitedTime[1]));
    return datetime;
  }
  return null;
};

export const convertTimeToString = (datetime: Date) => {
  if (datetime) {
    let splitTime = datetime.toTimeString()
      .match(/([0-9]+:[0-9]+)/g);
    if (splitTime) {
      return splitTime[0].replace(/^0+/, '');;
    }
  }
  return null;
};

export const getTimeInMinutes = (datetime: Date | null) => {
  if (datetime) {
    return datetime.getHours() * 60 + datetime.getMinutes();
  }
  return null;
};
