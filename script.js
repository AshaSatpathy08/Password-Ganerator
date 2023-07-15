const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// Initially defined variables
let password = ""; // Stores the generated password
let passwordLength = 10; // Length of the password (default value)
let checkCount = 0; // Count of selected checkboxes

handleSlider(); // Call the handleSlider function to initialize the slider
setIndicator("#ccc"); // Set the initial color of the strength indicator to grey

// Set passwordLength and update UI
function handleSlider() {
  inputSlider.value = passwordLength; // Set the value of the slider input
  lengthDisplay.innerText = passwordLength; // Update the length display
  const min = inputSlider.min;
  const max = inputSlider.max;
  // Set the background size of the slider based on the password length
  inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

// Set the color and shadow of the strength indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Generate a random integer between min (inclusive) and max (exclusive)
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Generate a random digit (0-9)
function generateRandomNumber() {
  return getRndInteger(0, 9);
}

// Generate a random lowercase character (a-z)
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

// Generate a random uppercase character (A-Z)
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

// Generate a random symbol from the symbols string
function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

// Calculate the strength of the password based on selected checkboxes and length
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // Strong password (green)
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
    setIndicator("#ff0"); // Medium password (yellow)
  } else {
    setIndicator("#f00"); // Weak password (red)
  }
}

// Copy the generated password to the clipboard
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active"); // Make the copy message span visible
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000); // Remove the active class after 2 seconds
}

// Shuffle the characters in an array to create a random order
function shufflePassword(array) {
  // Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// Handle the change event of checkboxes
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked)
      checkCount++;
  });

  // Special condition: if passwordLength is less than checkCount, update passwordLength
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// Add event listeners to checkboxes
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
});

// Handle the input event of the slider
inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// Handle the click event of the copy button
copyBtn.addEventListener('click', () => {
  if (passwordDisplay.value)
    copyContent();
});

// Handle the click event of the generate button
generateBtn.addEventListener('click', () => {
  if (checkCount == 0)
    return;

  // Update passwordLength if necessary
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  console.log("Starting the Journey");
  password = ""; // Clear the password

  // Add characters based on selected checkboxes
  let funcArr = [];

  if (uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

  if (numbersCheck.checked)
    funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked)
    funcArr.push(generateSymbol);

  // Add characters based on checkbox selection
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("Compulsory addition done");

  // Add remaining characters randomly
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex: " + randIndex);
    password += funcArr[randIndex]();
  }
  console.log("Remaining addition done");

  password = shufflePassword(Array.from(password)); // Shuffle the password characters
  console.log("Shuffling done");

  passwordDisplay.value = password; // Display the generated password in the UI
  console.log("UI addition done");

  calcStrength(); // Calculate the strength of the password
});
