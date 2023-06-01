//Add possible insurers to dropdown
const select = document.getElementById("insurer");
const options = new Set([]);
const insurers = data.forEach((item) => {
  options.add(item.insurer);
});
let alpha = Array.from(options).sort();
alpha.forEach((item) => {
  const option = document.createElement("option");
  option.value = item;
  option.text = item;
  select.add(option);
});
//Capture user's choice of insurer
let selectedInsurer;
select.addEventListener("change", () => {
  selectedInsurer = select.value;
});
//Add dates and months programmatically
const day = document.getElementById("signupDay");
const month = document.getElementById("signupMonth");
const year = document.getElementById("signupYear");
const populateDateData = () => {
  const days = 31;
  for (i = 1; i <= days; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? "0" + i : i.toLocaleString();
    option.text = i < 10 ? "0" + i : i.toLocaleString();
    day.add(option);
  }
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  for (i = 0; i <= months.length - 1; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? "0" + i : i.toLocaleString();
    option.text = months[i];
    month.add(option);
  }
  const years = ["2023", "2022", "2021", "2020", "2019", "2018"];
  for (i = 0; i <= years.length - 1; i++) {
    const option = document.createElement("option");
    option.value = years[i];
    option.text = years[i];
    year.add(option);
  }
};
populateDateData();
let formattedSignUpDate = "";
let selectedTextMonth = "January";
//Capture user's choice of date
let selectedDay = "01";
day.addEventListener("change", () => {
  selectedDay = day.value;
});
let selectedMonth = "01";
month.addEventListener("change", () => {
  selectedMonth = month.value;
  selectedTextMonth = month.options[month.selectedIndex].text;
});
let selectedYear = "2023";
year.addEventListener("change", () => {
  selectedYear = year.value;
});
//Massage the data in order to compare dates more easily
let formattedDate;
data.forEach((item) => {
  let dateStr = item.approvalDate;
  let dateObj = new Date(dateStr);
  let isoString = dateObj.toISOString();
  let formattedDate = isoString.slice(0, 10);
  item.approvalDate = formattedDate;
});
//Calculate rate increase
let increase = 0;
const calculateRateIncrease = (selectedInsurer, dateSelected, formatDateToText) => {
  let year = Number(dateSelected.slice(0, 4));
  //filter data based on which insurer they selected
  //only grab data for approved rate changes in the year they signed up and higher
  const smallDataset = data.filter((item) => {
    let comp = Number(item.approvalDate.slice(0, 4));
    return selectedInsurer === item.insurer && comp >= year;
  });
  //filter out their selected insurer
  const comparisonData = data.filter((item) => {
    return selectedInsurer !== item.insurer;
  });
  //Create an array made of smaller arrays grouped by insurer
  let groupedData = comparisonData.reduce((acc, obj) => {
    let key = obj.insurer;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
  let result = Object.values(groupedData);
  //Create an array of objects containing the name of the insuruer and the rate change for the same time period
  let arrayOfRateIncreases = [];
  result.forEach((array) => {
    let compareIncrease = 0;
    array.forEach((item) => {
      compareIncrease += Number(item.approvedRateChange);
    });
    let formatted = compareIncrease.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    arrayOfRateIncreases.push({
      insurer: array[0].insurer,
      rateIncreaseInTimeFrame: Number(formatted),
    });
  });
  //calculate increase
  smallDataset.forEach((item) => {
    let rateIncrease = Number(item.approvedRateChange);
    increase += rateIncrease;
  });
  //Display the rate increase, or, let user know there was no increase.
  const results = document.getElementById("results");
  let ul = document.createElement("div");
  ul.style.listStyle = "none";
  let formatted = increase.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (increase > 0) {
    //If there was an increase, show them lower increases
    //Only include insurers that had a lower rate change in this time period
    let lowerRates = [];
    arrayOfRateIncreases.forEach((item) => {
      if (Number(item.rateIncreaseInTimeFrame) < increase) {
        lowerRates.push(item);
      }
    });
    //Sort by lowest rates
    lowerRates.sort((a, b) => {
      return a.rateIncreaseInTimeFrame - b.rateIncreaseInTimeFrame;
    });
    for (i = 0; i < lowerRates.length; i++) {
      let li = document.createElement("p");
      // li.style.marginBottom = "5px";
      let text = document.createTextNode(
        `${lowerRates[i].insurer}: ${lowerRates[i].rateIncreaseInTimeFrame}%`
      );
      li.appendChild(text);
      ul.appendChild(li);
    }
    results.setAttribute("class", "res");
    results.innerHTML = `<div class="text-block"><p style="font-size: 21px; font-weight: 600;">Looks like ${selectedInsurer} has had <svg fill="#ff0000" height="15px" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#ff0000" transform="rotate(0)">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/> </g>

</svg><span style="font-weight: 700; color:#FF0000"> ${formatted}%</span> of FSRA approved rate increases come into effect since ${formatDateToText}.Their rates went up!</p><p style="font-style: italic">*This may not reflect your actual rate increase or decrease during this period. Insurance rates are recalculated periodically as risk factors of drivers change.</p>
        <p>We've taken the liberty of comparing this increase against other insurers to look for lower rate changes.</p>
        <p>In the same timeframe, these insurers had the following rate changes:<p></div>`;
    results.appendChild(ul);
    const container = document.querySelector(".container");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            results.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    results.addEventListener("animationend", () => {
      results.scrollIntoView({ behavior: "smooth" });
    });
    increase = 0;
  } else if (increase < 0) {
    formatted = formatted.slice(1);
    results.setAttribute("class", "res");
    results.innerHTML = `<p style="font-size: 21px">Lucky duck! Looks like ${selectedInsurer} has had <span class="svg-container"><svg fill="#50C878" height="15px" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#0ff000" transform="rotate(180)">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/> </g>

</svg><path d="assets/down-arrow.svg" /></svg></span><span style="font-weight: 700; color:#50C878"> ${formatted}%</span> of approved rate decreases come into effect since ${formatDateToText}. Their rates went down!</p><p style="font-style: italic">*This may not reflect your actual rate increase or decrease during this period. Insurance rates are recalculated periodically as risk factors of drivers change.</p>`;
    increase = 0;
  } else {
    results.setAttribute("class", "res");
    results.innerHTML = `<p style="font-size: 21px">Wow! ${selectedInsurer} hasn't had a rate increase come into effect since ${formatDateToText}!</p><p style="font-style: italic">*This may not reflect your actual rate increase or decrease during this period. Insurance rates are recalculated periodically as risk factors of drivers change.</p>`;
  }
};
//Perform calculations when button is clicked
const button = document.getElementById("calculate");
let formatDateToText = "";
button.addEventListener("click", () => {
  formatDateToText = `${selectedTextMonth} ${selectedDay}, ${selectedYear}`;
  formattedSignUpDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
  if (formattedSignUpDate !== "" && selectedInsurer != undefined && formatDateToText !== "") {
    calculateRateIncrease(selectedInsurer, formattedSignUpDate, formatDateToText);
  }
});
