const weekdayOpeningTime = 10;
const weekdayClosingTime = 16;
const saturdayOpeningTime = 12;
const saturdayClosingTime = 15;
function updateCurrentlyOpen(date) {
    let currentlyOpenTextNavbar = document.getElementById("currently-open-text-navbar");
    let currentlyOpenText = document.getElementById("currently-open-text");
    if (currentlyOpenTextNavbar == null)
        return;
    if (currentlyOpenText == null)
        return;
    let text = "";
    if (isCurrentlyOpen(date)) {
        text = "Just nu har vi öppet";
    }
    else if (!isClosedDay(date) && !hasOpened(date)) {
        text = "Vi öppnar klockan " + getOpeningTime(date.getDay()) + " idag";
    }
    else {
        // set the time of day used to check if open
        // all open days are open at 13:XX
        date.setHours(13);
        let iterations = 0;
        do {
            date.setDate(date.getDate() + 1);
            iterations += 1;
        } while (!isCurrentlyOpen(date));
        let day = date.getDay();
        if (iterations == 1) {
            text = "Vi öppnar klockan " + getOpeningTime(day) + " imorgon";
        }
        else {
            text = "Vi öppnar klockan " + getOpeningTime(day) + " på " + getDayName(day);
        }
    }
    currentlyOpenTextNavbar.innerText = text;
    currentlyOpenText.innerText = text;
}
function isCurrentlyOpen(date) {
    let day = date.getDay();
    let hour = date.getHours();
    if (isClosedDay(date))
        return false;
    let openingTime = getOpeningTime(day);
    let closingTime = getClosingTime(day);
    return hour >= openingTime && hour < closingTime;
}
function hasOpened(date) {
    let day = date.getDay();
    let hour = date.getHours();
    if (isClosedDay(date))
        return false;
    if (isWeekday(day)) {
        return hour >= weekdayOpeningTime;
    }
    else if (isSaturday(day)) {
        return hour >= saturdayOpeningTime;
    }
    else {
        return false;
    }
}
function isClosedDay(date) {
    const closedDays = [
        {
            month: 0,
            dayOfTheMonth: 1
        },
        {
            month: 0,
            dayOfTheMonth: 6
        },
        {
            month: 4,
            dayOfTheMonth: 1
        },
        {
            month: 5,
            dayOfTheMonth: 6
        },
        {
            month: 11,
            dayOfTheMonth: 24
        },
        {
            month: 11,
            dayOfTheMonth: 25
        },
        {
            month: 11,
            dayOfTheMonth: 26
        },
        {
            month: 11,
            dayOfTheMonth: 31
        }
    ];
    let dayMonth = {
        month: date.getMonth(),
        dayOfTheMonth: date.getDate()
    };
    if (isSunday(date.getDay()))
        return true;
    for (let i = 0; i < closedDays.length; i++) {
        if (closedDays[i].month == dayMonth.month && closedDays[i].dayOfTheMonth == dayMonth.dayOfTheMonth)
            return true;
    }
    return false;
}
function getOpeningTime(day) {
    if (isWeekday(day))
        return weekdayOpeningTime;
    if (isSaturday(day))
        return saturdayOpeningTime;
    return -1;
}
function getClosingTime(day) {
    if (isWeekday(day))
        return weekdayClosingTime;
    if (isSaturday(day))
        return saturdayClosingTime;
    return -1;
}
function isWeekday(day) {
    return day >= 1 && day <= 5;
}
function isSaturday(day) {
    return day == 6;
}
function isSunday(day) {
    return day == 0;
}
function getDayName(day) {
    switch (day) {
        case 0:
            return "söndag";
        case 1:
            return "måndag";
        case 2:
            return "tisdag";
        case 3:
            return "onsdag";
        case 4:
            return "torsdag";
        case 5:
            return "fredag";
        case 6:
            return "lördag";
        default:
            return "";
    }
}
window.setInterval(() => updateCurrentlyOpen(new Date()), 5000);
updateCurrentlyOpen(new Date());
