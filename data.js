const calcButton = document.getElementById("calculate")
const insurer = document.getElementById("insurer").value
const signupDate = document.getElementById("signupDate")
let date = new Date(signupDate.valueAsDate);
console.log(date, "??")
const calculateIncrease = (insurer, signupdate) => {

}
calcButton.addEventListener("click", calculateIncrease(insurer, date))

