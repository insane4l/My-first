document.addEventListener('DOMContentLoaded', function() {
'use strict'

let addBudgetBtn = document.querySelector('.add-budget'),
    addExpensesBtn = document.querySelector('.add-expenses'),
    appData = {
        income: 0,
        expenses: 0,
        expensesList: {},
        date: {},
        dayBudget: 0,
        balance: 0
    };



//button -> remove 'this' list-item (.data-li)
let removeLI = function(event) {
    let thisListItem = event.target.closest('.data-li');
    
    if ( thisListItem.closest('.budget-block') ) {
        let budgetInput = document.querySelectorAll('.budget-input');
        thisListItem.remove();
        summarizeBudget();
        console.warn('change variable scope of this function');///how its still working now???
        budgetInput.forEach( (item) => item.disabled = false );
        console.dir(appData);
    } else if ( thisListItem.closest('.expenses-block') ) {
        let expensesInput = document.querySelectorAll('.expenses-input');
        thisListItem.remove();
        appData.expensesList = {}; //maybe "for in" + "delete appData.[key]"
        summarizeExpenses();
        console.warn('change variable scope of this function');
        expensesInput.forEach( (item) => item.disabled = false );
        console.dir(appData);
    }
    
};

let findAllRemoveBtns = function() {
    let removeBtn = document.querySelectorAll('.remove-li');
    removeBtn.forEach( (item) => item.addEventListener('click', removeLI) );
};
findAllRemoveBtns();

//button -> +1 list-item budget-block => data list
let addBudgetLI = function() {
    let budgetListItem = document.createElement('li'),
        budgetList = document.querySelector('.budget-block .data-list');

    budgetListItem.classList.add('data-li');
    budgetListItem.innerHTML = 
    `<input class="input budget-input" type="text" placeholder="Источник дохода">
    <input class="input budget-input" type="text" placeholder="Сумма">
    <button class="remove-li"></button>`;
    budgetList.appendChild(budgetListItem);
    findAllRemoveBtns();
};
addBudgetBtn.addEventListener('click', addBudgetLI);

//button -> +1 list-item expenses-block => data list
let addExpensesLI = function() {
    let expensesListItem = document.createElement('li'),
        expensesList = document.querySelector('.expenses-block .data-list');
    
    expensesListItem.classList.add('data-li');
    expensesListItem.innerHTML = 
    `<input class="input expenses-input" type="text" placeholder="Наименование">
    <input class="input expenses-input" type="text" placeholder="Сумма">
    <button class="remove-li"></button>`;
    expensesList.appendChild(expensesListItem);
    findAllRemoveBtns();
};
addExpensesBtn.addEventListener('click', addExpensesLI);





//button -> clear budget-block inputs
let clearBudgetBtn = document.querySelector('.clear-budget-btn');

clearBudgetBtn.addEventListener('click', function() {
    let budgetInput = document.querySelectorAll('.budget-input');
    budgetInput.forEach( (item) => {item.value = ''; item.disabled = false});
});

//button -> clear expenses-block inputs
let clearExpensesBtn = document.querySelector('.clear-expenses-btn');

clearExpensesBtn.addEventListener('click', function() {
    let expensesInput = document.querySelectorAll('.expenses-input');
    expensesInput.forEach( (item) => {item.value = ''; item.disabled = false});
});

// let budgetInput = document.querySelectorAll('.budget-input');
//     budgetInput[0].value = 'kuku';
//     budgetInput[1].value = '1000';
//     budgetInput[2].value = 'himan';
//     budgetInput[3].value = '2000';
//button -> summarize income money and disable inputs
let summarizeBudget = function() {
    let budgetInput = document.querySelectorAll('.budget-input'),
        sum = 0;

    budgetInput.forEach(function(item, i) {
        item.disabled = true;
        if ( i%2 !== 0 && !isNaN(+budgetInput[i].value) && budgetInput[i].value !== '' && +budgetInput[i].value > 0) {
            sum = sum + +budgetInput[i].value;
        } else if ( 
            ( i%2 !== 0 && (isNaN(+budgetInput[i].value) || budgetInput[i].value == '' || +budgetInput[i].value <= 0) )
            || ( i%2 == 0 && (!isNaN(+budgetInput[i].value) || budgetInput[i].value == '' || budgetInput[i].value.length <= 1) )
            ) {
            item.disabled = false;
            alert('Введите корректные значения');
        }
    });
    appData.income = sum;
    console.dir(appData);
};

let confirmBudgetBtn = document.querySelector('.confirm-budget-btn');
confirmBudgetBtn.addEventListener('click', summarizeBudget);

//button -> summarize expenses and create expanses list to appData (also disable inputs)
let summarizeExpenses = function() {
    let expensesInput = document.querySelectorAll('.expenses-input'),
        sum = 0;

    expensesInput.forEach(function(item, i) {
        if (i%2 == 0) {
            let expenseName = item.value;
            appData.expensesList[expenseName] = +expensesInput[++i].value;
        } else {
            sum = sum + +expensesInput[i].value;
        }
    });
    appData.expenses = sum;
    expensesInput.forEach( (item) => item.disabled = true);
    console.dir(appData);
};

let confirmExpensesBtn = document.querySelector('.confirm-expenses-btn');
confirmExpensesBtn.addEventListener('click', summarizeExpenses);



//count day budget 
Date.prototype.getMonthDays = function () {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};
// let budgetDate = new Date( Date.parse('2021-02') );
// console.log(budgetDate);
// console.log(budgetDate.getMonthDays());
let checkDate = function() {
    let dateInput = document.querySelector('.time-data-input'),
    budgetDate = new Date( Date.parse(dateInput.value) );

    if ( dateInput.value.match(/\d\d\d\d\-\d\d/gi) ) {
        console.log('TRUE');
    } else {
        console.log('FALSE');
    }
}

let countDayBudget = function() {
    let allBudgetOption = document.querySelector('#allbudget-option'),
        balanceOption = document.querySelector('#balance-option'),
        dayBudget = document.querySelector('.daybudget .result-value');
    if (allBudgetOption.checked == true) {
        appData.dayBudget = +( appData.income / budgetDate.getMonthDays() ).toFixed(1);
    } else if (balanceOption.checked == true) {
        appData.dayBudget = +( appData.balance / budgetDate.getMonthDays() ).toFixed(1);
    } else {
        alert('Произошла ошибка, пожалуйста выберите из какой суммы расчитать бюджет на день');
    }
    dayBudget.textContent = appData.dayBudget;
};

let countBalance = function(callback) {
    let balance = document.querySelector('.balance .result-value');
    appData.balance = appData.income - appData.expenses;
    balance.textContent = appData.balance;
    callback();
};

let countPercentage = function() {
    let i = 0;
    for (let key in appData.expensesList) {
        let percentageBlock = document.querySelector('.percentage-block'),
            percentageItem = document.createElement('div');

        percentageItem.classList.add('percentage-item');
        percentageItem.innerHTML = `
            <div class="expenses-name"></div>
            <div class="expenses-percentage"></div>`;
        percentageBlock.appendChild(percentageItem);

        let expensesName = document.querySelectorAll('.expenses-name'),
            expensesPrecentage = document.querySelectorAll('.expenses-percentage');
            
        
        expensesName[i].textContent = key + ':';
        expensesPrecentage[i].textContent = Math.round( appData.expensesList[key] / (appData.expenses / 100) ) + '%';
        i++;

    }
};
//count Incoming and Expenses
let countIncExp = function() {
    let income = document.querySelector('.income .result-value'),
        expenses = document.querySelector('.expenses .result-value');
    income.textContent = appData.income;
    expenses.textContent = appData.expenses;
};


let showResult = function() {
    countBalance(countDayBudget);
    countIncExp();
    countPercentage();
};



//START





let start = document.querySelector('.start');
start.addEventListener('click', checkDate);



});