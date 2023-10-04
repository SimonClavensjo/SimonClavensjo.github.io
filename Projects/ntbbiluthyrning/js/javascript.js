window.setInterval(function () {
	setLiveOpeningHours(new Date());
}, 30000); //Every 30 sec

document.addEventListener("DOMContentLoaded", function () {
	const cars = [
		{ name: "Audi A6", year: "2011", price: "800\u00A0kr" },
		{ name: "Audi S3", year: "2015", price: "450\u00A0kr" },
		{ name: "Cadillac Escalade", year: "1999", price: "500\u00A0kr" },
		{ name: "Kia Carens", year: "2022", price: "400\u00A0kr" },
		{ name: "Kia Soul", year: "2020", price: "400\u00A0kr" },
		{ name: "Mitsubishi Outlander", year: "2018", price: "450\u00A0kr" },
		{ name: "Renault Kadjar", year: "2020", price: "250\u00A0kr" },
		{ name: "Subaru Outback", year: "2020", price: "300\u00A0kr" },
		{ name: "Volvo XC40", year: "2018", price: "800\u00A0kr" },
		{ name: "VW Polo", year: "2022", price: "300\u00A0kr" },
	];
	const tableBody = document.getElementById("carList");

	cars.forEach(function (car) {
		const row = document.createElement("tr");
		const nameCell = document.createElement("td");
		const yearCell = document.createElement("td");
		const priceCell = document.createElement("td");

		nameCell.textContent = car.name;
		yearCell.textContent = car.year;
		priceCell.textContent = car.price;

		row.appendChild(nameCell);
		row.appendChild(yearCell);
		row.appendChild(priceCell);

		tableBody.appendChild(row);
	});
});

function isDateClosed(year, month, day) {

	if (!(isValid(day, month, year))) {
		month = (month + 1) % 12;
		day -= daysInMonth(month - 1, day);
	};

	const closedDays = [
		{ month: 0, day: 1 },
		{ month: 0, day: 6 },
		{ month: 4, day: 1 },
		{ month: 5, day: 6 },
		{ month: 11, day: 24 },
		{ month: 11, day: 25 },
		{ month: 11, day: 26 },
		{ month: 11, day: 31 },
	];

	for (const closedDay of closedDays) {
		if (closedDay.month === month && closedDay.day === day) {
			return true;
		}
	}
	return false;
}

// Check if there is a week change and if so returns the right day of the new week
function getDayWeekLoop(day, additionalDays) {
	if (day + additionalDays > 6) {
		return day + additionalDays - 7;
	} else if (day + additionalDays == NaN) {
		return 0;
	} else {
		return day + additionalDays;
	};
};

function daysInMonth(m, y) {
	switch (m) {
		case 1:
			return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
		case 8: case 3: case 5: case 10:
			return 30;
		default:
			return 31
	}
}
// Checks if date is valid
function isValid(d, m, y) {
	return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(m, y);
}

// Look for next open day
function checkNextOpen(year, month, dayOfMonth, dayOfWeek, days, openingHours, element) {
	let daysTillOpen = 0;


	if (dayOfWeek !== 6) { // If not saturday

		// Checks how many days untill next open day
		while (isDateClosed(year, month, dayOfMonth + daysTillOpen + 1) || getDayWeekLoop(dayOfWeek + daysTillOpen) == 0 || (month == 11 && dayOfMonth == 31)) {
			daysTillOpen++;
			if (!(isValid(dayOfMonth + daysTillOpen, month, year))) {
				month = (month + 1) % 12;
				dayOfMonth = 1;
			};
		};

		const nextOpenDay = getDayWeekLoop(dayOfWeek, daysTillOpen);

		if (nextOpenDay === 5) { //if friday
			element.innerText = `Öppnar ${days[nextOpenDay + 1]} kl ${openingHours.saturday.open
				}`;
			storeIsOpen = false;
		} else {
			element.innerText = `Öppnar ${days[nextOpenDay + 1]} kl ${openingHours.weekdays.open
				}`;
			storeIsOpen = false;
		};

	} else if (isDateClosed(year, month, dayOfMonth + 2)) { // if next monday is closed

		while (isDateClosed(year, month, dayOfMonth + daysTillOpen + 1) || getDayWeekLoop(dayOfWeek + daysTillOpen) === 0) {
			daysTillOpen++;
			if (!(isValid(dayOfMonth + daysTillOpen, month, year))) {
				month = (month + 1) % 12;
				dayOfMonth = 1;
			};
		};

		const nextOpenDay = getDayWeekLoop(dayOfWeek, daysTillOpen)

		if (nextOpenDay === 5) {
			element.innerText = `Öppnar ${days[nextOpenDay + 1]} kl ${openingHours.saturday.open
				}`;
			storeIsOpen = false;
		} else {
			element.innerText = `Öppnar ${days[nextOpenDay + 1]} kl ${openingHours.weekdays.open
				}`;
			storeIsOpen = false;
		};
	}

	else {
		element.innerText = `Öppnar måndag kl ${openingHours.weekdays.open}`;
		storeIsOpen = false;
	}
}

function setLiveOpeningHours(date) {
	const year = date.getFullYear()
	const month = date.getMonth();
	const dayOfMonth = date.getDate();
	const dayOfWeek = date.getDay(); // Gets day of week
	const hour = date.getHours();
	const minute = date.getMinutes();

	const element = document.getElementById("storeState");
	const rightNowSpan = document.createElement("span");
	const openSpan = document.createElement("span");
	let storeIsOpen;


	const openingHours = {
		weekdays: { open: 10, close: 16 },
		saturday: { open: 12, close: 15 },
	};

	const days = [
		"Nan",
		"måndag",
		"tisdag",
		"onsdag",
		"torsdag",
		"fredag",
		"lördag",
	];

	if (isDateClosed(year, month, dayOfMonth)) {
		checkNextOpen(year, month, dayOfMonth, dayOfWeek, days, openingHours, element)
	}

	//If weekday
	else if (dayOfWeek < 6 && dayOfWeek > 0) {
		if (hour === openingHours.weekdays.open - 1 && minute >= 30) {
			//30 min before opening
			element.innerText = `Öppnar om ${60 - minute} minuter`;
			storeIsOpen = false;
		} else if (hour === openingHours.weekdays.close - 1 && minute >= 45) {
			//15 min before closing
			element.innerText = `Stänger snart`;
			storeIsOpen = true;
		} else if (
			hour >= openingHours.weekdays.open &&
			hour < openingHours.weekdays.close
		) {
			rightNowSpan.innerText = "Just nu: ";
			rightNowSpan.style.color = "black";

			openSpan.innerText = "Öppet";
			openSpan.style.color = "green";

			element.innerHTML = "";

			element.appendChild(rightNowSpan);
			element.appendChild(openSpan);
			storeIsOpen = true;
		} else if (hour < openingHours.weekdays.open) {
			element.innerText = `Öppnar idag kl ${openingHours.weekdays.open}`;
		} else {
			checkNextOpen(year, month, dayOfMonth, dayOfWeek, days, openingHours, element);
		};
	} //Saturday
	else if (dayOfWeek == 6) {
		if (hour === openingHours.saturday.open - 1 && minute >= 30) {
			element.innerText = `Öppnar om ${60 - minute} minuter`;
			storeIsOpen = false;
		} else if (hour === openingHours.saturday.close - 1 && minute >= 45) {
			element.innerText = `Stänger snart`;
			storeIsOpen = true;
		} else if (
			hour >= openingHours.saturday.open &&
			hour < openingHours.saturday.close
		) {
			rightNowSpan.innerText = "Just nu: ";
			rightNowSpan.style.color = "black";

			openSpan.innerText = "Öppet";
			openSpan.style.color = "green";

			element.innerHTML = "";

			element.appendChild(rightNowSpan);
			element.appendChild(openSpan);
			storeIsOpen = true;
		} else if (hour < openingHours.saturday.open) {
			element.innerText = `Öppnar idag kl ${openingHours.saturday.open}`;
			storeIsOpen = false;
		} else {
			checkNextOpen(year, month, dayOfMonth, dayOfWeek, days, openingHours, element);
		};
	} //Sunday
	else if (dayOfWeek == 0) {
		checkNextOpen(year, month, dayOfMonth, dayOfWeek, days, openingHours, element);
	};

	liveStoreStateHeader(storeIsOpen);
};

function liveStoreStateHeader(storeIsOpen) {
	const storeOpenElement = document.getElementById("storeOpen");
	const storeClosedElement = document.getElementById("storeClosed");

	if (storeIsOpen === false) {
		storeClosedElement.style.color = "red";
		storeOpenElement.style.color = "white";
	} else {
		storeClosedElement.style.color = "white";
		storeOpenElement.style.color = "green";
	}
};

function scrollToInfo(id) {
	setTimeout(() => {
		document.getElementById(id).scrollIntoView();
	}, 500);
};

zipCodeList = [
	"98132",
	"98135",
	"98136",
	"98137",
	"98138",
	"98139",
	"98140",
	"98142",
	"98143",
	"98144",
	"98146",
	"98147",
];

document.addEventListener("DOMContentLoaded", (event) => {
	document
		.querySelector("#zipCodeCheck form")
		.addEventListener("submit", (event) => {
			event.preventDefault();

			// event.submitter.parentNode.querySelector("#number").value
			// is what is written in the input
			let zipInput =
				event.submitter.parentNode.querySelector("#zipNumber").value;
			zipInput = zipInput.split(" ").join(""); //removes spaces from string

			if (zipInput.match(/\D/) != null) {
				document.querySelector("#output").innerHTML =
					"Inte ett giltigt postnummer.";
			} else if (zipInput.length != 5) {
				document.querySelector("#output").innerHTML =
					"Inte ett giltigt postnummer.";
			} else if (zipCodeList.includes(zipInput)) {
				document.querySelector("#output").innerHTML =
					"Vi kör ut, ring telefonnumret ovan!";
			} else {
				document.querySelector("#output").innerHTML =
					"Vi kör tyvärr inte ut till dig.";
			}
		});
});

// Closed days automatic order
function getNewClosedDaysList(date) {
	let month = date.getMonth();
	let closedDaysList = Array.from(document.getElementById('closedDaysList').children);
	let dayOfMonth = date.getDate();
	let dateRegex = /[0-9]{1,2}/g

	for (let i = 0; i < closedDaysList.length; i++) {
		let itemDayOfMonth = closedDaysList[i].innerHTML.match(dateRegex)[0];
		let itemMonth = closedDaysList[i].innerHTML.match(dateRegex)[1];

		if (itemMonth < month + 1) {
			let parent = closedDaysList[i].parentNode;
			parent.removeChild(closedDaysList[i]);
			parent.appendChild(closedDaysList[i]);
		} else if (itemMonth == month + 1 && itemDayOfMonth < dayOfMonth) {
			let parent = closedDaysList[i].parentNode;
			parent.removeChild(closedDaysList[i]);
			parent.appendChild(closedDaysList[i]);
		}
	}
}

