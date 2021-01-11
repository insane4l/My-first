document.addEventListener('DOMContentLoaded', function() {
'use strict'

let addBudgetBtn = document.querySelector('.add-budget'),
    addExpensesBtn = document.querySelector('.add-expenses');



    
//remove by btn 'this' list-item (.data-li)
let removeLI = function(event) {
    let thisListItem = event.target.closest('.data-li');
    thisListItem.style.display = 'none';
};

let findAllRemoveBtns = function() {
    let removeBtn = document.querySelectorAll('.remove-li');
    removeBtn.forEach((item) => item.addEventListener('click', removeLI));
};
findAllRemoveBtns();

//+1 list-item budget-block => data list
let addBudgetLI = function() {
    let budgetListItem = document.createElement('li'),
        budgetList = document.querySelector('.budget-block .data-list');

    budgetListItem.classList.add('data-li');
    budgetListItem.innerHTML = 
    `<input class="input budget-item" type="text" placeholder="Источник дохода">
    <input class="input budget-item" type="text" placeholder="Сумма">
    <button class="remove-li"></button>`;
    budgetList.appendChild(budgetListItem);
    findAllRemoveBtns();
};
addBudgetBtn.addEventListener('click', addBudgetLI);

//+1 list-item expenses-block => data list
let addExpensesLI = function() {
    let expensesListItem = document.createElement('li'),
        expensesList = document.querySelector('.expenses-block .data-list');
    
    expensesListItem.classList.add('data-li');
    expensesListItem.innerHTML = 
    `<input class="input expenses-item" type="text" placeholder="Наименование">
    <input class="input expenses-item" type="text" placeholder="Сумма">
    <button class="remove-li"></button>`;
    expensesList.appendChild(expensesListItem);
    findAllRemoveBtns();
};
addExpensesBtn.addEventListener('click', addExpensesLI);












});