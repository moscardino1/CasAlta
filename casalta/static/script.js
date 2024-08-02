
import { optionCount, formatNumber, createOptionElement } from './options.js';
import { updateAmortizationSchedule } from './amortizations.js';

// Your existing code in script.js


function calculateMortgageDetails(price, percent, amount, amortization, rate, frequency) {
    const totalMortgage = price - amount;
    const periodicRate = (rate / 100) / (frequency === 'monthly' ? 12 : 26);
    const numberOfPayments = amortization * (frequency === 'monthly' ? 12 : 26);
    const mortgagePayment = totalMortgage * 
        (periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) / 
        (Math.pow(1 + periodicRate, numberOfPayments) - 1);
    
    return { totalMortgage, mortgagePayment };
}



function updateCalculations() {
    const price = parseFloat(document.getElementById('price').value) || 0;
    const exchangeRate = parseFloat(document.getElementById('exchange-rate').value) || 1;

    for (let i = 1; i <= optionCount; i++) {
        const percentInput = document.getElementById(`down-payment-percent-${i}`);
        const amountInput = document.getElementById(`down-payment-amount-${i}`);
        const amortizationInput = document.getElementById(`amortization-${i}`);
        const rateInput = document.getElementById(`rate-${i}`);
        const frequencyInput = document.getElementById(`frequency-${i}`);
        
        const percent = parseFloat(percentInput.value.replace(/,/g, '')) || 0;
        const amount = parseFloat(amountInput.value.replace(/,/g, '')) || 0;
        const amortization = parseInt(amortizationInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;
        const frequency = frequencyInput.value;

     
        // Update down payment amount or percent
        if (document.activeElement === percentInput) {
            updateAmountFromPercent(price, percent, amountInput);
        } else if (document.activeElement === amountInput) {
            updatePercentFromAmount(price, amount, percentInput);
        }

        const percentUpdated = parseFloat(percentInput.value.replace(/,/g, '')) || 0;
        const amountUpdated = parseFloat(amountInput.value.replace(/,/g, '')) || 0;

 
        const { totalMortgage, mortgagePayment } = calculateMortgageDetails(price, percentUpdated, amountUpdated, amortization, rate, frequency);
        const totalMortgageShared = totalMortgage / 2;
        const mortgagePaymentShared = mortgagePayment / 2;

        document.getElementById(`total-mortgage-${i}`).textContent = formatNumber(totalMortgage / exchangeRate);
        document.getElementById(`total-mortgage-${i}-shared`).textContent = `(shared: ${formatNumber(totalMortgageShared / exchangeRate)})`;
        document.getElementById(`mortgage-payment-${i}`).textContent = formatNumber(mortgagePayment / exchangeRate);
        document.getElementById(`mortgage-payment-${i}-shared`).textContent = `(shared: ${formatNumber(mortgagePaymentShared / exchangeRate)})`;
    }

    updateCloseCost();
    updateMonthlyExpenses();
    updateRevenues();
}

function updateAmountFromPercent(price, percent, amountInput) {
    const calculatedAmount = price * percent / 100;
     // Directly set value without formatting to see if it updates
    amountInput.value = calculatedAmount;
}

function updatePercentFromAmount(price, amount, percentInput) {
    const calculatedPercent = (amount / price) * 100;
     // Directly set value without formatting to see if it updates
    percentInput.value = calculatedPercent;
}


function updateCloseCost() {
    const scenario = parseInt(document.getElementById('scenario').value);
    const exchangeRate = parseFloat(document.getElementById('exchange-rate').value);
    const costs = {
        downPayment: parseFloat(document.getElementById(`down-payment-amount-${scenario}`).value),
        lawyerFees: parseFloat(document.getElementById('lawyer-fees').value),
        titleInsurance: parseFloat(document.getElementById('title-insurance').value),
        homeInspection: parseFloat(document.getElementById('home-inspection').value),
        appraisalFees: parseFloat(document.getElementById('appraisal-fees').value),
    };
    
    const sharedCosts = Object.fromEntries(
        Object.entries(costs).map(([key, value]) => [`${key}Shared`, value / 2])
    );

    const cashNeededToClose = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    const cashNeededToCloseShared = cashNeededToClose / 2;

    for (const [key, value] of Object.entries(costs)) {
        document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase()).textContent = formatNumber(value / exchangeRate);
        document.getElementById(`${key.replace(/([A-Z])/g, '-$1').toLowerCase()}-shared`).textContent = `(shared: ${formatNumber(sharedCosts[`${key}Shared`] / exchangeRate)})`;
    }

    document.getElementById('cash-needed-to-close').textContent = formatNumber(cashNeededToClose / exchangeRate);
    document.getElementById('cash-needed-to-close-shared').textContent = `(shared: ${formatNumber(cashNeededToCloseShared / exchangeRate)})`;
    updateMonthlyExpenses();
    updateRevenues() 
}

function updateMonthlyExpenses() {
    const expenses = {
        propertyTax: parseFloat(document.getElementById('property-tax').value),
        utilities: parseFloat(document.getElementById('utilities').value),
        propertyInsurance: parseFloat(document.getElementById('property-insurance').value) ,
        phone: parseFloat(document.getElementById('phone').value),
        cable: parseFloat(document.getElementById('cable').value),
        internet: parseFloat(document.getElementById('internet').value)
    };

    const totalMonthlyExpenses = Object.values(expenses).reduce((sum, expense) => sum + expense, 0);

    document.getElementById('monthly-expenses-total').textContent = formatNumber(totalMonthlyExpenses);

    const scenario = parseInt(document.getElementById('scenario').value);
    const mortgagePayment = parseFloat(document.getElementById(`mortgage-payment-${scenario}`).textContent.replace(/,/g, ''));
    const totalMonthlyCost = mortgagePayment + totalMonthlyExpenses;
    
    document.getElementById('total-monthly-cost').textContent = formatNumber(totalMonthlyCost);
    updateRevenues() 
}

function updateRevenues() {
    const rentedDays = parseFloat(document.getElementById('rented-days').value);
    const estimatedRentedPrice = parseFloat(document.getElementById('estimated-rented-price').value);
    const totalMonthlyCost = parseFloat(document.getElementById('total-monthly-cost').textContent.replace(/,/g, ''));

    // Calculate Total Revenue and Annual Profit
    const totalRevenue = rentedDays * estimatedRentedPrice;
    const annualCost = (totalMonthlyCost * 12);
    const annualProfit = totalRevenue - annualCost;

    // Update the UI
    document.getElementById('total-revenue').textContent = formatNumber(totalRevenue);
    document.getElementById('annual-cost').textContent = formatNumber(annualCost);
    document.getElementById('annual-profit').textContent = formatNumber(annualProfit);
}

// Call updateRevenues initially
updateRevenues();

document.addEventListener('DOMContentLoaded', function() {
    const optionsContainer = document.getElementById('options-container');
    for (let i = 1; i <= optionCount; i++) {
        optionsContainer.innerHTML += createOptionElement(i);
    }

    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', updateCalculations);
    });

    updateCalculations(); // Initial calculation
}); 
 

// Call the function on scenario change and on page load
document.getElementById('scenario').addEventListener('change', updateAmortizationSchedule);
document.addEventListener('DOMContentLoaded', updateAmortizationSchedule);
