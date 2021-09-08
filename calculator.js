function add(a, b) {
    // Computing addition
    if (a == 'Answer OOB' || b == 'Answer OOB') {
        return 'Answer OOB'
    }
    let compute = a + b;
    let ans = reduceNumSize(compute)
    return ans;
};

function subtract(a, b) {
    // Computing subtraction
    if (a == 'Answer OOB' || b == 'Answer OOB') {
        return 'Answer OOB'
    }
    let compute = a - b;
    let ans = reduceNumSize(compute)
    return ans;
};

function multiply(a, b) {
    // Computing multiplication
    if (a == 'Answer OOB' || b == 'Answer OOB') {
        return 'Answer OOB'
    }
    let compute = a * b;
    let ans = reduceNumSize(compute)
    return ans;
};

function divide(a, b) {
    // Computing division
    if (a == 'Answer OOB' || b == 'Answer OOB') {
        return 'Answer OOB'
    }
    let compute = a / b;
    let ans = reduceNumSize(compute)
    return ans;
};

function reduceNumSize(num) {
    // Reduce the size of the computed number so that it fits on the display.
    // Numbers that are too large receive an Answer Out of Bounds display.
    let numArray = [...num.toString()]

    // Logic to deal with floating point numbers (when decimals are present)
    if (numArray.includes('.')) {
        // If number has a decimal in the last display position, remove and display whole number.
        if (numArray.indexOf('.') == 10) {
            let shortenedNum = parseFloat(numArray.slice(0, 9).join(''));
            return shortenedNum;
        // If number has a decimal one past the last display position, display just the whole number.
        } else if (numArray.indexOf('.') == 11) {
            let shortenedNum = parseFloat(numArray.slice(0, 10).join(''));
            return shortenedNum;
        // If decimal position within display range, display number and decimals up to 10 digits.
        } else if (numArray.indexOf('.') < 10) {
            let shortenedNum = parseFloat(numArray.slice(0, 10).join(''));
            return shortenedNum;
        } else if (numArray.indexOf('.') > 11) {
            return 'Answer OOB'
        }
    } else if (numArray.length >= 11) {
        return 'Answer OOB'
    } else {
        return num
    }
};

function operate(operator, a, b) {
    // Direct what operation is performed
    switch (operator) {
        case 'plus':
            return add(a, b);
            break;
        case 'sub':
            return subtract(a, b);
            break;
        case 'mul':
            return multiply(a, b);
            break;
        case 'div':
            return divide(a, b);
            break;
    }
}

function numPress(num) {
    // Modify the display and current number in memory when a number gets pressed
    let displayArray = [...display.textContent]
    if (displayArray.length >= 11) {
        return;
    }
    // When the display is in start state (only number 0) replace 0 with pressed number
    if (displayArray[0] == 0 && displayArray.length == 1) {
        displayArray = [num];
        display.textContent = displayArray.join('');
        if (displayArray.includes('.')) {
            currentValue = parseFloat(displayArray.join(''));
        } else {
            currentValue = parseInt(displayArray.join(''), 10);
        }
    // When display is no longer in starting state (just a single digit 0), push value to end of number
    } else {
        displayArray.push(num)
        display.textContent = displayArray.join('')
        if (displayArray.includes('.')) {
            currentValue = parseFloat(displayArray.join(''));
        } else {
            currentValue = parseInt(displayArray.join(''), 10);
        }
    }
}

function dotPress() {
    // Appends a decimal point to the current number & display when pressing the dot key
    let displayArray = [...display.textContent];
    if (displayArray.length >= 10) {
        return;
    }
    if (displayArray.includes('.')) {
        return;
    }
    displayArray.push('.');
    display.textContent = displayArray.join('');
}

function backPress() {
    // Deletes the latest entered key from the current value and display
    let displayArray = [...display.textContent];
    if (displayArray.length == 1 && displayArray[0] == 0) {
        return;
    }
    if (displayArray.length == 1 && displayArray[0] != 0) {
        displayArray = [0];
        display.textContent = displayArray.join('');
        currentValue = parseInt(displayArray.join(''), 10);
    } else if (displayArray.length > 1) {
        displayArray.pop()
        display.textContent = displayArray.join('')
        if (displayArray.includes('.')) {
            currentValue = parseFloat(displayArray.join(''));
        }
        currentValue = parseInt(displayArray.join(''), 10)
    }
}

function clearCurrent() {
    // Clears just the current value and resets display
    display.textContent = 0;
    currentValue = 0;
}

function clearMemory() {
    // Clears both the current value and the value stored in memory as well
    display.textContent = 0;
    currentValue = 0;
    previousValue = 0;
}

function equals(operator) {
    // When equals button is pushed, retrieves the computed answer, saves as current value, and displays it
    if (previousValue == 0 && equalRepeat == true) {
        let answer = operate(operator, currentValue, repeatValue);
        currentValue = answer;
        display.textContent = answer;
     } else {
        let answer = operate(operator, previousValue, currentValue);
        equalRepeat = true;
        previousValue = 0;
        repeatValue = currentValue;
        currentValue = answer;
        display.textContent = answer;
    }
}

function prep(current, operator) {
    // Store value and prepare for incoming value when operation key is pressed
    if (previousValue == 0) {
        previousValue = current;
        currentOperation = operatorTable[operator];
        equalRepeat = false;
        currentValue = 0;
        display.textContent = 0;
    } else {
        previousValue = operate(operatorTable[operator], previousValue, currentValue);
        currentOperation = operatorTable[operator];
        equalRepeat = false;
        currentValue = 0;
        display.textContent = 0;
    }
}

let display = document.querySelector('#display-nums')
let equalRepeat = false;
let previousValue = 0;
let repeatValue;
let currentValue;
let currentOperation;
const operatorTable = {
    '+':'plus',
    '-':'sub',
    '*':'mul',
    '/':'div',
}

const numberButtons = Array.from(document.querySelectorAll('.numbtn'));
numberButtons.forEach(button => button.addEventListener('click', function() {numPress(button.textContent)}));

const operationButtons = Array.from(document.querySelectorAll('.opbtn'));
operationButtons.forEach(button => button.addEventListener('click', function() {prep(currentValue, button.textContent)}))

const back = document.querySelector('#back');
const clear = document.querySelector('#clear');
const clearmem = document.querySelector('#clearmem');
const equal = document.querySelector('#equal');
const dot = document.querySelector('#dot');

dot.addEventListener('click', function() {dotPress()});
equal.addEventListener('click', function() {equals(currentOperation)})
back.addEventListener('click', function() {backPress()})
clear.addEventListener('click', function() {clearCurrent()});
clearmem.addEventListener('click', function() {clearMemory()});

// Adds keyboard compatibility
document.addEventListener('keydown', (e) => {
    var keyval = e.key;

    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(keyval)) {
        numPress(keyval);
    } else if (['+', '-', '*', '/'].includes(keyval)) {
        prep(currentValue, keyval);
    } else if (['.'].includes(keyval)) {
        dotPress();
    } else if (['=', 'Enter'].includes(keyval)) {
        equals(currentOperation);
    } else if (['Backspace'].includes(keyval)) {
        backPress();
    }
  }, false);






