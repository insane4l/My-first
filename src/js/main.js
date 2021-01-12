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
    thisListItem.style.display = 'none';
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


//button -> summarize income money
let summarizeBudget = function() {
    let budgetInput = document.querySelectorAll('.budget-input'),
        sum = 0;

    budgetInput.forEach(function(item, i) {
        if (i%2 !== 0) {
            sum = sum + +budgetInput[i].value;
        }
    });
    appData.income = sum;
    budgetInput.forEach( (item) => item.disabled = true);
};

let confirmBudgetBtn = document.querySelector('.confirm-budget-btn');
confirmBudgetBtn.addEventListener('click', summarizeBudget);

//button -> summarize expenses and create expanses list to appData
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
};

let confirmExpensesBtn = document.querySelector('.confirm-expenses-btn');
confirmExpensesBtn.addEventListener('click', summarizeExpenses);



//count day budget 

let countDayBudget = function() {
    let allBudgetRadio = document.querySelector('#allbudget-radio'),
        balanceRadio = document.querySelector('#balance-radio');
    if (allBudgetRadio.checked == true) {
        appData.dayBudget = appData.income / 30;
        console.warn('check appData.date 28 30 31 days??????');
    } else if (balanceRadio.checked == true) {
        appData.dayBudget = appData.balance / 30;
        console.warn('check appData.date 28 30 31 days??????');
    }
};







});