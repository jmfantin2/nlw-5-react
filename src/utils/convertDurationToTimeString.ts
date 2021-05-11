export const convertDurationToTimeString = (duration: number) : String => {
  //duration is in seconds
  const hours = Math.floor(duration/(3600));
  const minutes = Math.floor((duration%3600)/60);
  const seconds = duration%60;

  //two digits maximum for every number, separated by :
  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2,'0'))
    .join(':');

  return timeString; 
}