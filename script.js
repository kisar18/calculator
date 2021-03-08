const outputWindow = document.querySelector('.computation')
const resultWindow = document.querySelector('.result')
const numbers = document.querySelectorAll('.number')
const clear = document.querySelector('.clear')
const equal = document.querySelector('.equal')
const operations = document.querySelectorAll('.operation')
const comma = document.querySelector('.comma')

var computation = ""

clear.addEventListener('click', () => {
    computation = ""
    outputWindow.innerHTML = computation
    resultWindow.innerHTML = computation
})

numbers.forEach(number => {
    number.addEventListener('click', () => {
        computation += number.innerHTML
        outputWindow.innerHTML = computation
    })
})

equal.addEventListener('click', () => {
    computation += equal.innerHTML
    outputWindow.innerHTML = computation
    var result = makeOperation(computation)
    var stringOutput = parseFloatResult(result)
    resultWindow.innerHTML = stringOutput
    computation = ""
})


operations.forEach(operation => {
    operation.addEventListener('click', () => {
        computation += operation.innerHTML
        outputWindow.innerHTML = computation
    })
})

comma.addEventListener('click', () => {
    computation += comma.innerHTML
    outputWindow.innerHTML = computation
})

function makeOperation(comp) {
    var n1 = ""
    var n2 = ""
    var numbersAndOperations = []
    var wasOpeartion = false
    var wasOpeartionWithHighPriority = false
    var lastPositionToRemeber
    var operation
    var res
    var decimalPlaces = 0
    let numbersDecimalPlaces = []
    var isFloat = false

    for(let i = 0; i < comp.length - 1; i++) {

        if (comp[i] != "+" && comp[i] != "-" && comp[i] != "×" && comp[i] != "÷"  && comp[i] != ",") {
            if (wasOpeartion == false) {
                n1 += comp[i]
                if (isFloat == true) {
                    decimalPlaces += 1
                }
                if (i == comp.length - 2) {
                    numbersAndOperations.push(parseFloat(n1))
                    numbersDecimalPlaces.push(decimalPlaces)
                    decimalPlaces = 0
                    isFloat = false
                    n1 = ""
                }
            }
            else {
                n1 = ""
                n1 += comp[i]
                isFloat = false
                wasOpeartion = false
                if (i == comp.length - 2) {
                    numbersAndOperations.push(parseFloat(n1))
                    numbersDecimalPlaces.push(decimalPlaces)
                    decimalPlaces = 0
                    n1 = ""
                }
            }
        }
        else if (comp[i] == ",") {
            n1 += '.'
            isFloat = true
        }
        else {
            wasOpeartion = true
            numbersAndOperations.push(parseFloat(n1))
            numbersAndOperations.push(comp[i])
            numbersDecimalPlaces.push(decimalPlaces)
            decimalPlaces = 0
        }
    }

    console.log(numbersAndOperations, numbersDecimalPlaces)

    for(let i = 0; i < numbersAndOperations.length - 1; i++) {

        if (numbersAndOperations[i] == "ToBeDeleted") {
            continue
        }

        if (numbersAndOperations[i] == "×" || numbersAndOperations[i] == "÷") {
            if (wasOpeartionWithHighPriority == false) {
                n1 = numbersAndOperations[i - 1]
                n2 = numbersAndOperations[i + 1]
                operation = numbersAndOperations[i]
                res = makeComputation(operation, n1, n2, Math.max.apply(null, numbersDecimalPlaces))
                numbersAndOperations[i - 1] = parseFloat(res)
                lastPositionToRemeber = i - 1
                numbersAndOperations[i] = "ToBeDeleted"
                numbersAndOperations[i + 1] = "ToBeDeleted"
                wasOpeartionWithHighPriority = true
            }
            else {
                n1 = res
                n2 = numbersAndOperations[i + 1]
                operation = numbersAndOperations[i]
                res = makeComputation(operation, n1, n2, Math.max.apply(null, numbersDecimalPlaces))
                numbersAndOperations[lastPositionToRemeber] = parseFloat(res)
                numbersAndOperations[i] = "ToBeDeleted"
                numbersAndOperations[i + 1] = "ToBeDeleted"
            }
        }
        else if (numbersAndOperations[i] == "+" || numbersAndOperations[i] == "-") {
            wasOpeartionWithHighPriority = false
        }
    }

    console.log(numbersAndOperations)

    var counter = 0
    while (counter != numbersAndOperations.length) {
        if (numbersAndOperations[counter] == "ToBeDeleted") {
            numbersAndOperations.splice(counter, 1)
        }
        else {
            counter += 1
        }
    }

    for(let i = 0; i < numbersAndOperations.length - 1; i++) {
        
        if (i == 0) {
            n1 = numbersAndOperations[0]
            operation = numbersAndOperations[i + 1]
            n2 = numbersAndOperations[i + 2]
            n1 = makeComputation(operation, n1, n2, Math.max.apply(null, numbersDecimalPlaces))
        }
        else if (i > 2 && typeof(numbersAndOperations[i]) == "string") {
            operation = numbersAndOperations[i]
            n2 = numbersAndOperations[i + 1]
            n1 = makeComputation(operation, n1, n2, Math.max.apply(null, numbersDecimalPlaces))
        }
        else {
            continue
        }
    }
    res = n1
    return res
}

function makeComputation(operation, n1, n2, maxDecimalPlaces) {
    var result
    if (operation == "+") {
        result = n1 + n2
    }
    else if (operation == "-") {
        result = n1 - n2
    }
    else if (operation == "×") {
        result = n1 * n2
    }
    else if (operation == "÷" && n2 != 0) {
        result = n1 / n2
    }

    return parseFloat(result).toFixed(maxDecimalPlaces)
}

function parseFloatResult(res) {

    var tmp = String(res)
    var resToOutput = ""
    for (let i = 0; i < tmp.length; i++) {
        if (tmp[i] == '.') {
            resToOutput += ','
        }
        else {
            resToOutput += tmp[i]
        }
    }
    return resToOutput
}