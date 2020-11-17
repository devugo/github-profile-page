function getById(id) {
    return document.getElementById(id);
}
function getByClassName(className) {
    return document.getElementsByClassName(className);
}

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * Format date time to human readable
 **/
const formatUpdatedTime = (datetime) => {
    //  Format time
    let updatedDatetime = new Date(datetime);
    var seconds = Math.floor((new Date() - updatedDatetime) / 1000);

    let monthsAgo = seconds / 2592000;
    if(monthsAgo < 1){
        let daysAgo = seconds / 86400;
        if (daysAgo > 1) {
            return `Updated ${Math.floor(daysAgo)} days ago`;
        }
        let hoursAgo = seconds / 3600;
        if (hoursAgo > 1) {
            return `Updated ${Math.floor(hoursAgo)} hours ago`;
        }
        let minutesAgo = seconds / 60;
        if (minutesAgo > 1) {
            return `Updated ${Math.floor(minutesAgo)} minutes ago`;
        }
        return `Updated ${Math.floor(seconds)} seconds ago`;
    }

    let lastUpdatedDate = updatedDatetime.getDate();
    let lastUpdatedMonth = months[updatedDatetime.getMonth()];
    return `Updated on ${lastUpdatedMonth} ${lastUpdatedDate}`;
}