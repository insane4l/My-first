document.addEventListener('DOMContentLoaded', function() {
'use strict'



Date.prototype.getMonthDays = function () {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};


const pageContent = document.querySelector('.main-content'),
    dataSection = document.querySelector('.main-content .data'),
    resultSection = document.querySelector('.main-content .result'),
    articlesBlock = document.querySelectorAll('.articles-block'),

    dateInput = document.querySelector('.time-data-input'),

    addBudgetBtn = document.querySelector('.add-budget'),
    addExpensesBtn = document.querySelector('.add-expenses'),
    clearBudgetBtn = document.querySelector('.clear-budget-btn'),
    clearExpensesBtn = document.querySelector('.clear-expenses-btn'),
    confirmBudgetBtn = document.querySelector('.confirm-budget-btn'),
    confirmExpensesBtn = document.querySelector('.confirm-expenses-btn'),
    readyBtn = document.querySelector('.ready'),
    startBtn = document.querySelector('.start'),
    printBtn = document.querySelector('.print-btn'),
    resetBtn = document.querySelector('.reset-btn'),
    closeResult = document.querySelector('.close-result'),

    percentageBlock = document.querySelector('.percentage-block'),
    incomeResult = document.querySelector('.income .result-value'),
    expensesResult = document.querySelector('.expenses .result-value'),
    dayBudgetResult = document.querySelector('.daybudget .result-value'),
    balanceResult = document.querySelector('.balance .result-value');

    
const appData = {
        income: 0,
        expenses: 0,
        expensesList: {},
        monthDays: 0,
        dayBudget: 0,
        balance: 0,
        verificationStatus: {
            dataListInputs: false,
            dateInput: false
        },

        removeLI: function(event) {
            let target = event.target,
                removeBtn = target.matches('button.remove-li'),
                thisListItem = event.target.closest('.data-li');

            if ( removeBtn && thisListItem.closest('.budget-block') ) {
                let budgetInputs = document.querySelectorAll('.budget-input');
                thisListItem.remove();
                appData.income = 0;
                budgetInputs.forEach( (item) => item.disabled = false );
            } else if ( removeBtn && thisListItem.closest('.expenses-block') ) {
                let expensesInputs = document.querySelectorAll('.expenses-input');
                thisListItem.remove();
                appData.expensesList = {};
                appData.expenses = 0;
                expensesInputs.forEach( (item) => item.disabled = false );
            }
        },

        addBudgetLI: function() {
            let budgetListItem = document.createElement('li'),
                budgetList = document.querySelector('.budget-block .data-list');

            budgetListItem.classList.add('data-li');
            budgetListItem.innerHTML = 
                `<input class="input budget-input" type="text" placeholder="Источник дохода">
                <input class="input budget-input" type="text" placeholder="Сумма">
                <button class="remove-li"></button>`;
            budgetList.appendChild(budgetListItem);
        },

        addExpensesLI: function() {
            let expensesListItem = document.createElement('li'),
                expensesList = document.querySelector('.expenses-block .data-list');
            
            expensesListItem.classList.add('data-li');
            expensesListItem.innerHTML = 
                `<input class="input expenses-input" type="text" placeholder="Наименование">
                <input class="input expenses-input" type="text" placeholder="Сумма">
                <button class="remove-li"></button>`;
            expensesList.appendChild(expensesListItem);
        },

        summarizeBudget: function() {
            let budgetInputs = document.querySelectorAll('.budget-input'),
                sum = 0;
            budgetInputs.forEach(function(item, i) {
                item.disabled = true;
                if ( i%2 !== 0 && !isNaN(+item.value) && item.value !== '' && +item.value > 0 ) {
                    sum = sum + +item.value;
                } else if ( 
                    ( i%2 !== 0 && (isNaN(+item.value) || item.value == '' || +item.value <= 0) )
                    || ( i%2 == 0 && (!isNaN(+item.value) || item.value == '' || item.value.length <= 1) ) 
                ) {
                    item.disabled = false;
                    item.value = '';
                    alert('Введите корректное значение в поле номер ' + ++i);
                    item.placeholder = i;
                }
            });
            appData.income = sum;
        },

        summarizeExpenses: function() {
            let expensesInputs = document.querySelectorAll('.expenses-input'),
                sum = 0,
                errorStatus = false;
            expensesInputs.forEach(function(item, i) {
                item.disabled = true;
                if (i%2 == 0 && isNaN(+item.value) && item.value !== '' && item.value.length > 1) {
                    let expenseName = item.value;
                    appData.expensesList[expenseName] = +expensesInputs[++i].value;
                } else if (i%2 !== 0 && !isNaN(+item.value) && item.value !== '' && +item.value > 0 ) {
                    sum = sum + +expensesInputs[i].value;
                } else if ( 
                    ( i%2 == 0 && (!isNaN(+item.value) || item.value == '' || item.value.length <= 1) )
                    || ( i%2 !== 0 && (isNaN(+item.value) || item.value == '' || +item.value <= 0) ) 
                ) {
                    item.disabled = false;
                    item.value = '';
                    errorStatus = true;
                    appData.expenses = 0;
                    appData.expensesList = {};
                } else {
                    alert('Произошла ошибка' );
                }
            });
            if (errorStatus === true) {
                alert('Введите корректные значения в пустые поля' );
            }
            appData.expenses = sum;
        },

        clearInputs: function(event) {
            let budgetInputs = document.querySelectorAll('.budget-input'),
                expensesInputs = document.querySelectorAll('.expenses-input');
            let chooseInputs = function(input) {
                input.forEach( (item) => {item.value = ''; item.disabled = false});
            };
            if (event.target.matches('.clear-budget-btn')){
                chooseInputs(budgetInputs);
                appData.income = 0;
            } else {
                chooseInputs(expensesInputs);
                appData.expensesList = {};
                appData.expenses = 0;
            }
        },

        setDate: function() {
            let months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                            'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
                budgetDate = new Date( Date.parse(dateInput.value) ),
                budgetMonth = budgetDate.getMonth(),
                budgetYear = budgetDate.getFullYear(),
                budgetDays = budgetDate.getMonthDays(),
                dateTitle = document.querySelector('.budget-date');

            dateInput.disabled = true;
            appData.monthDays = budgetDays;
            dateTitle.textContent = ('на ' + months[budgetMonth] + ' ' + budgetYear + ' года');
        },

        countDayBudget: function() {
            let allBudgetOption = document.querySelector('#allbudget-option'),
                balanceOption = document.querySelector('#balance-option');
            if (allBudgetOption.checked == true) {
                appData.dayBudget = +(appData.income / appData.monthDays).toFixed(1);
            } else if (balanceOption.checked == true) {
                appData.dayBudget = +(appData.balance / appData.monthDays).toFixed(1);
            } else {
                alert('Произошла ошибка, пожалуйста выберите из какой суммы расчитать бюджет на день');
            }
            dayBudgetResult.textContent = appData.dayBudget;
        },

        countBalance: function() {
            appData.balance = appData.income - appData.expenses;
            balanceResult.textContent = appData.balance;
        },

        countPercentage: function() {
            let i = 0;
            for (let key in appData.expensesList) {
                let percentageItem = document.createElement('div');
                percentageItem.classList.add('percentage-item');
                percentageItem.innerHTML = `
                    <div class="expenses-name"></div>
                    <div class="expenses-value"></div>
                    <div class="expenses-percentage"></div>`;
                percentageBlock.appendChild(percentageItem);

                let expensesName = document.querySelectorAll('.expenses-name'),
                    expensesValue = document.querySelectorAll('.expenses-value'),
                    expensesPrecentage = document.querySelectorAll('.expenses-percentage'),
                    percentageValue = Math.round( appData.expensesList[key] / (appData.expenses / 100) );
                          
                expensesName[i].textContent = key + ':';
                expensesValue[i].textContent = appData.expensesList[key];
                expensesPrecentage[i].textContent = `(${percentageValue}%)`;
                i++;
            }
        },

        setIncExp: function() {
            incomeResult.textContent = appData.income;
            expensesResult.textContent = appData.expenses;
        },

        getStarted: function() {
            //verificate all data-list inputs
            let dataListInputs = document.querySelectorAll('.data-list .input');
            appData.verificationStatus.dataListInputs = true;
            for ( let i = 0; i < dataListInputs.length; i++ ) {
                if (dataListInputs[i].disabled === false) {
                    appData.verificationStatus.dataListInputs = false;
                    alert('Заполните все пустые поля доходов/расходов и утвердите');
                    return;
                }
            }
            if ( dateInput.value.match(/\d\d\d\d\-\d\d/gi) ) {
                let arr1 = /\-\d\d/g.exec(dateInput.value), // from 2021-02       take into array this part -02
                    arr2 = /\d\d/.exec(arr1[0]), // from -02      take into array this part 02
                    monthFromUser = +arr2[0]; // take from array number 02 
                if (monthFromUser <= 12) {
                    appData.verificationStatus.dateInput = true;
                    appData.setDate();
                    appData.setIncExp();
                    appData.countPercentage();
                    appData.countBalance();
                    readyBtn.style.display = 'none';
                    startBtn.style.display = 'block';
                    setTimeout(function() {
                        let animationMask = document.querySelector('.start .mask');
                        animationMask.classList.add('show-mask');
                    }, 500);
                } else {
                    appData.verificationStatus.dateInput = false;
                    alert('Некорректно указан месяц. Допустимые значения от 01 до 12');
                    return;
                }
            } else {
                appData.verificationStatus.dateInput = false;
                alert('Пожалуйста введите дату согласно заданному формату ГОД-МЕСЯЦ, например: 2021-01');
                return;
            }
        },    

        showResultPage: function() {
            //check all options appData.verificationStatus{}, they must be verificated
            //Optional: if the application will be improved
            for (let key in appData.verificationStatus) {
                if (appData.verificationStatus[key] === false) {
                    alert('Ошибка в заполнененных данных, пожалуйста проверьте');
                    return;
                }
            }
            appData.countDayBudget(); //need run appData.checkDate() and appData.countBalance() before this 
            pageContent.style.transform = 'translateY' + '(-' + dataSection.clientHeight + 'px)';
            resultSection.style.display = 'block';
            document.body.style.height = resultSection.clientHeight + 100 +'px';
        },

        printResult: function() {
            let allElements = document.querySelectorAll('body *'),
                printableSection = document.querySelector('.result-content'),
                printableContent = document.querySelectorAll('.result-content *'),
                printableTitle = document.querySelector('.budget-date');
        
            allElements.forEach( (item) => {
                if (item.contains(printableSection) || item.contains(printableTitle)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            printableSection.style.display = 'flex';
            printableTitle.style.display = 'inline-block';
            printableContent.forEach( (item) => item.style.display = 'flex');
            pageContent.style.transform = 'translateY(0)';
            window.print();
        },

        reloadPage: () => window.location.href = window.location.href,
};



const {
    removeLI, addBudgetLI, addExpensesLI, summarizeBudget,
    summarizeExpenses, clearInputs, getStarted,
    showResultPage, printResult, reloadPage
} = appData;

addBudgetBtn.addEventListener('click', addBudgetLI);
addExpensesBtn.addEventListener('click', addExpensesLI);
articlesBlock.forEach( function(item) { item.addEventListener('click', removeLI) } );
confirmBudgetBtn.addEventListener('click', summarizeBudget);
confirmExpensesBtn.addEventListener('click', summarizeExpenses);
clearBudgetBtn.addEventListener('click', clearInputs);
clearExpensesBtn.addEventListener('click', clearInputs);
readyBtn.addEventListener('click', getStarted);
startBtn.addEventListener('click', showResultPage);
printBtn.addEventListener('click', printResult);
resetBtn.addEventListener('click', reloadPage);
closeResult.addEventListener('click', reloadPage);



});