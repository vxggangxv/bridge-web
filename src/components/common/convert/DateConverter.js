import moment from 'moment';

/**
 * <DateConverter 
      timestamp={dueDate}
      format="YYYY-MM-DD"
    />
 * @param {*} props 
 */
function DateConverter(props) {
  const { date, timestamp, format = 'YYYY-MM-DD', replace = null } = props;

  if (timestamp) {
    return moment.unix(timestamp).format(format);
  }

  if (date) {
    return moment(date).format(format);
  }

  return replace;
}

export default DateConverter;
