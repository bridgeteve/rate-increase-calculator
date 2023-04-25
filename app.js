//Add possible insurers to dropdown
const select = document.getElementById("insurer");
const options = new Set([]);
const insurers = data.forEach((item) => {
    options.add(item.insurer);
});
let alpha = Array.from(options).sort();
alpha.forEach((item) => {
    const option = document.createElement("option")
    option.value = item
    option.text = item
    select.add(option)
});
//Capture user's choice of insurer
let selectedInsurer 
select.addEventListener("change", () => {
    selectedInsurer = select.value
});
//Capture user's choice of date
const input = document.getElementById("signupDate")
let dateSelected 
input.addEventListener("change", () => {
    dateSelected = input.value
});
//Massage the data in order to compare dates more easily
data.forEach((item) => {
        let dateStr = item.approvalDate
        let dateObj = new Date(dateStr)
        let isoString = dateObj.toISOString();
        let formattedDate = isoString.slice(0, 10)
        item.approvalDate = formattedDate;
})
//Calculate rate increase 
let increase = 0
const calculateRateIncrease = (selectedInsurer, dateSelected) => {
    let year = Number(dateSelected.slice(0, 4))
    //filter data based on which insurer they selected
    //only grab data for approved rate changes in the year they signed up and higher
    const smallDataset = data.filter((item) => {
        let comp = Number(item.approvalDate.slice(0,4))
        return selectedInsurer === item.insurer && comp >= year
    });
    //filter out their selected insurer
    const comparisonData = data.filter((item) => {
        return selectedInsurer !== item.insurer
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
    let arrayOfRateIncreases = []
    result.forEach((array) => {
        let compareIncrease = 0
        array.forEach((item) => {
            compareIncrease += Number(item.approvedRateChange)
        })
        let formatted = compareIncrease.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits:2});
        arrayOfRateIncreases.push({insurer: array[0].insurer, rateIncreaseInTimeFrame: Number(formatted)})
    })
    //calculate increase
    smallDataset.forEach((item) => {
        let rateIncrease = Number(item.approvedRateChange)
        increase += rateIncrease
    })
    //Display the rate increase, or, let user know there was no increase.
    const results = document.getElementById("results")
    let ul = document.createElement('ul');
    ul.style.listStyle = "none";
    let formatted = increase.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits:2});
    if (increase > 0) {
        //If there was an increase, show them lower increases
        //Only include insurers that had a lower rate change in this time period
        let lowerRates = []
        arrayOfRateIncreases.forEach((item) => {
            if (Number(item.rateIncreaseInTimeFrame) < increase) {
                lowerRates.push(item)
            }
        });
        //Sort by lowest rates
        lowerRates.sort((a, b) => {
            return a.rateIncreaseInTimeFrame - b.rateIncreaseInTimeFrame
        })
        for (i = 0; i < lowerRates.length; i++) {
            let li = document.createElement('li');
            li.style.marginBottom = "5px";
            let text = document.createTextNode(`${lowerRates[i].insurer}: ${lowerRates[i].rateIncreaseInTimeFrame}%`)
            li.appendChild(text);
            ul.appendChild(li)
        };
        results.setAttribute("class", "res");
        results.innerHTML = `<p>Looks like your rate went up by ${formatted}%!</p>
        <p>We've taken the liberty of comparing your increase against other insurers.</p>
        <p>In the same timeframe, these insurers had the following rate changes:<p>`;
        results.appendChild(ul);
        increase = 0;
    } else if (increase < 0) {
        formatted = formatted.slice(1)
        results.setAttribute("class", "res");
        results.innerText = `Wow! Looks like your rate went down by ${formatted}%`
        increase = 0;
    } else {
        results.setAttribute("class", "res");
        results.innerText = "Lucky duck! No increase for you."
    }
};
//Perform calculations when button is clicked
const button = document.getElementById("calculate")
button.addEventListener("click", () => {
    calculateRateIncrease(selectedInsurer, dateSelected)
});
