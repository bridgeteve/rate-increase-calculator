//Add possible insurers to dropdown
const select = document.getElementById("insurer");
const options = new Set([]);
const insurers = data.forEach((item) => {
    options.add(item.insurer);
});
options.forEach((item) => {
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
    console.log(smallDataset, "did she do it??")
    //calculate increase
    smallDataset.forEach((item) => {
        let rateIncrease = Number(item.approvedRateChange)
        increase += rateIncrease
    })
    console.log(increase, "show me the increase")
    //Display the rate increase, or, let user know there was no increase.
    const results = document.getElementById("results")
    if (increase > 0) {
        results.setAttribute("class", "res");
        results.innerText = `Looks like your rate went up by ${increase}%`
    } else {
        results.setAttribute("class", "res");
        results.innerText = "Lucky duck! No increase for you."
    }
};
//Perform calculation when button is clicked
const button = document.getElementById("calculate")
button.addEventListener("click", () => {
    calculateRateIncrease(selectedInsurer, dateSelected)
});
