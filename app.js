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
  for (i = 0; i <= months.length; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? "0" + i : i.toLocaleString();
    option.text = months[i];
    month.add(option);
  }
  const years = ["2023", "2022", "2021", "2020", "2019", "2018"];
  for (i = 0; i <= years.length; i++) {
    const option = document.createElement("option");
    option.value = years[i];
    option.text = years[i];
    year.add(option);
  }
};
populateDateData();

//Capture user's choice of date
let selectedDay = "01";
day.addEventListener("change", () => {
  selectedDay = day.value;
});
let selectedMonth = "01";
month.addEventListener("change", () => {
  selectedMonth = month.value;
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
const calculateRateIncrease = (selectedInsurer, dateSelected) => {
  console.log(dateSelected, "lets see her");
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
  let ul = document.createElement("ul");
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
      let li = document.createElement("li");
      li.style.marginBottom = "5px";
      let text = document.createTextNode(
        `${lowerRates[i].insurer}: ${lowerRates[i].rateIncreaseInTimeFrame}%`
      );
      li.appendChild(text);
      ul.appendChild(li);
    }
    results.setAttribute("class", "res");
    results.innerHTML = `<p style="font-size: 19px">Looks like your rate went up by <span style="font-weight: 700; color:#FF0000">${formatted}%</span>!</p>
        <p>We've taken the liberty of comparing your increase against other insurers to look for lower rate changes.</p>
        <p>In the same timeframe, these insurers had the following rate changes:<p>`;
    results.appendChild(ul);
    results.addEventListener("animationend", () => {
      results.scrollIntoView({ behavior: "smooth" });
    });
    increase = 0;
  } else if (increase < 0) {
    formatted = formatted.slice(1);
    results.setAttribute("class", "res");
    results.innerHTML = `<p style="font-size: 19px">Wow! Looks like your rate went down by <span style="font-weight: 700; color:#50C878">${formatted}%</span>!</p>`;
    increase = 0;
  } else {
    results.setAttribute("class", "res");
    results.innerHTML = `<p style="font-size: 19px">Lucky duck! No increase for you.</p>`;
  }
};
//Perform calculations when button is clicked
const button = document.getElementById("calculate");
button.addEventListener("click", () => {
  let formattedSignUpDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
  if (formattedSignUpDate !== "" && selectedInsurer != undefined) {
    calculateRateIncrease(selectedInsurer, formattedSignUpDate);
  }
});
