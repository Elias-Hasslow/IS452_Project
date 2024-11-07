// Export function to format Date to string in '%Y-%m-%d %H:%M:%S' format
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  // Export function to parse the string back to a Date object
  export const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
  
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
  
    // Create and return the Date object
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };
  
  // Export function to add seconds to the current date and return formatted date
  export const addSecondsToCurrentDate = (seconds) => {
    const currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + seconds);  // Add the input seconds to the current date
    return formatDate(currentDate);  // Return the formatted date
  };
  