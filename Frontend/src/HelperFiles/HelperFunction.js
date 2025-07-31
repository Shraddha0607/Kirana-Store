const formattedCurrency = (number) => {
            return (
                        number?.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'INR', // Change to your desired currency code
                        }))
}

const formatDate = (isoDate) => {
            const date = new Date(isoDate);
            const readableDate = date?.toLocaleString('en-US', {
                        //weekday: 'long',   Full weekday (e.g., Friday)
                        year: 'numeric',   // Full year (e.g., 2024)
                        month: 'numeric',     // Full month (e.g., September)
                        day: 'numeric',    // Day of the month (e.g., 13)
                        hour: 'numeric',   // Hours (e.g., 5 PM)
                        minute: 'numeric', // Minutes (e.g., 20)
                        //second: 'numeric', // Seconds (e.g., 58)
                        hour12: true       // 12-hour format (AM/PM)
            })

            return readableDate
}

function debounce(func, delay) {
            let timeout;
            return (...args) => {
              clearTimeout(timeout); // Clear the previous timer
              timeout = setTimeout(() => {
                func.apply(this, args); // Execute the function after the delay
              }, delay);
            };
          }

export {formatDate,formattedCurrency,debounce}