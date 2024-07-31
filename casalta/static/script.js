
const optionCount = 4;

function formatNumber(number) {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function createOptionElement(index) {
    return `
        <div class="option" id="option${index}">
            <h3>Option ${index}</h3>
            <div class="input-group">
                <label for="down-payment-percent-${index}">Down payment %:</label>
                <input type="number" id="down-payment-percent-${index}" value="20" step="1.00" min="0" max="100">
            </div>
            <div class="input-group">
                <label for="down-payment-amount-${index}">Down payment:</label>
                <input type="number" id="down-payment-amount-${index}" value="20000" step="10000" min="0">
            </div>
            <div class="input-group">
                <label for="amortization-${index}">Amortization (years):</label>
                <input type="number" id="amortization-${index}" value="20" min="1" max="40">
            </div>
            <div class="input-group">
                <label for="rate-${index}">Mortgage rate (%):</label>
                <input type="number" id="rate-${index}" value="2" step="0.1" min="1" max="20">
            </div>
            <div class="input-group">
                <label for="frequency-${index}">Payment frequency:</label>
                <select id="frequency-${index}">
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                </select>
            </div>
            <div class="result">
                <label>Total mortgage:</label>
                <span id="total-mortgage-${index}"></span>
                <span id="total-mortgage-${index}-shared"></span>
            </div>
            <div class="result">
                <label>Mortgage Payment:</label>
                <span id="mortgage-payment-${index}"></span>
                <span id="mortgage-payment-${index}-shared"></span>
            </div>
        </div>
    `;
}

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
    const price = parseFloat(document.getElementById('price').value);
    const exchangeRate = parseFloat(document.getElementById('exchange-rate').value);

    for (let i = 1; i <= optionCount; i++) {
        const percentInput = document.getElementById(`down-payment-percent-${i}`);
        const amountInput = document.getElementById(`down-payment-amount-${i}`);
        const amortizationInput = document.getElementById(`amortization-${i}`);
        const rateInput = document.getElementById(`rate-${i}`);
        const frequencyInput = document.getElementById(`frequency-${i}`);
        
        const percent = parseFloat(percentInput.value);
        const amount = parseFloat(amountInput.value);
        const amortization = parseInt(amortizationInput.value);
        const rate = parseFloat(rateInput.value);
        const frequency = frequencyInput.value;

        // Update down payment amount or percent
        if (document.activeElement === percentInput) {
            amountInput.value = formatNumber(price * percent / 100);
        } else if (document.activeElement === amountInput) {
            percentInput.value = formatNumber(amount / price * 100);
        }
        
        const { totalMortgage, mortgagePayment } = calculateMortgageDetails(price, percent, amount, amortization, rate, frequency);
        const totalMortgageShared = totalMortgage / 2;
        const mortgagePaymentShared = mortgagePayment / 2;
        
        document.getElementById(`total-mortgage-${i}`).textContent = formatNumber(totalMortgage / exchangeRate);
        document.getElementById(`total-mortgage-${i}-shared`).textContent = `(shared: ${formatNumber(totalMortgageShared / exchangeRate)})`;
        document.getElementById(`mortgage-payment-${i}`).textContent = formatNumber(mortgagePayment / exchangeRate);
        document.getElementById(`mortgage-payment-${i}-shared`).textContent = `(shared: ${formatNumber(mortgagePaymentShared / exchangeRate)})`;
    }
    updateCloseCost();
    updateMonthlyExpenses();
    updateRevenues() 
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
        propertyTax: parseFloat(document.getElementById('property-tax').value) / 12,
        utilities: parseFloat(document.getElementById('utilities').value),
        propertyInsurance: parseFloat(document.getElementById('property-insurance').value) / 12,
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
    const annualProfit = totalRevenue - (totalMonthlyCost * 12);

    // Update the UI
    document.getElementById('total-revenue').textContent = formatNumber(totalRevenue);
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
// Function to calculate amortization schedule
function generateAmortizationSchedule(price, amount, amortization, rate, frequency) {
    const totalMortgage = price - amount;
    const periodicRate = (rate / 100) / (frequency === 'monthly' ? 12 : 26);
    const numberOfPayments = amortization * (frequency === 'monthly' ? 12 : 26);
    
    // Calculate monthly payment
    const monthlyPayment = totalMortgage * 
        (periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) / 
        (Math.pow(1 + periodicRate, numberOfPayments) - 1);

    let balance = totalMortgage;
    let totalPaid = 0;
    let principalPaid = 0;
    let interestPaid = 0;

    const years = [];
    const totalPaidData = [];
    const principalPaidData = [];
    const interestPaidData = [];
    const balanceData = [];

    for (let year = 1; year <= amortization; year++) {
        let yearTotalPaid = 0;
        let yearPrincipalPaid = 0;
        let yearInterestPaid = 0;
        for (let month = 1; month <= 12; month++) {
            if (balance <= 0) break;

            const interest = balance * periodicRate;
            const principal = monthlyPayment - interest;
            yearTotalPaid += monthlyPayment;
            yearPrincipalPaid += principal;
            yearInterestPaid += interest;

            balance -= principal;
            if (balance < 0) balance = 0;

            totalPaid += monthlyPayment;
            principalPaid += principal;
            interestPaid += interest;
        }

        years.push(year);
        totalPaidData.push(yearTotalPaid);
        principalPaidData.push(yearPrincipalPaid);
        interestPaidData.push(yearInterestPaid);
        balanceData.push(balance);
    }

    return {
        years,
        totalPaidData,
        principalPaidData,
        interestPaidData,
        balanceData
    };
}

// Function to update the amortization schedule table
function updateAmortizationSchedule() {
    const price = parseFloat(document.getElementById('price').value);
    const scenario = parseInt(document.getElementById('scenario').value);
    const amount = parseFloat(document.getElementById(`down-payment-amount-${scenario}`).value);
    const amortization = parseInt(document.getElementById(`amortization-${scenario}`).value);
    const rate = parseFloat(document.getElementById(`rate-${scenario}`).value);
    const frequency = document.getElementById(`frequency-${scenario}`).value;

    const {
        years,
        totalPaidData,
        principalPaidData,
        interestPaidData,
        balanceData
    } = generateAmortizationSchedule(price, amount, amortization, rate, frequency);

    const tableBody = document.getElementById('amortization-table').querySelector('tbody');
    tableBody.innerHTML = years.map((year, index) => `
        <tr>
            <td>${year}</td>
            <td>${formatNumber(totalPaidData[index])}</td>
            <td>${formatNumber(principalPaidData[index])}</td>
            <td>${formatNumber(interestPaidData[index])}</td>
            <td>${formatNumber(balanceData[index])}</td>
        </tr>
    `).join('');
}

// Format number as currency
function formatNumber(number) {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
let amortizationChart = null; // Variable to store the Chart instance

// Function to clear the existing chart
function clearChart() {
    if (amortizationChart) {
        amortizationChart.destroy();
        amortizationChart = null;
    }
}

// Function to draw the amortization chart
function drawAmortizationChart(years, totalPaidData, principalPaidData, interestPaidData, balanceData) {
    const ctx = document.getElementById('amortization-chart').getContext('2d');
    
    clearChart(); // Clear the previous chart instance

    amortizationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Principal Paid',
                    data: principalPaidData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    stack: 'stack1',
                    type: 'bar'
                },
                {
                    label: 'Interest Paid',
                    data: interestPaidData,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    stack: 'stack1',
                    type: 'bar'
                },
                {
                    label: 'Balance',
                    type: 'line',
                    data: balanceData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y-axis-2'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.dataset.label}: $${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    },
                    beginAtZero: true
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    beginAtZero: true
                },
                'y-axis-2': {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Balance ($)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to generate amortization schedule data
function generateAmortizationSchedule(price, amount, amortization, rate, frequency) {
    const totalMortgage = price - amount;
    const periodicRate = (rate / 100) / (frequency === 'monthly' ? 12 : 26);
    const numberOfPayments = amortization * (frequency === 'monthly' ? 12 : 26);
    
    // Calculate monthly payment
    const monthlyPayment = totalMortgage * 
        (periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) / 
        (Math.pow(1 + periodicRate, numberOfPayments) - 1);

    let balance = totalMortgage;
    let totalPaid = 0;
    let principalPaid = 0;
    let interestPaid = 0;

    const years = [];
    const totalPaidData = [];
    const principalPaidData = [];
    const interestPaidData = [];
    const balanceData = [];

    for (let year = 1; year <= amortization; year++) {
        let yearTotalPaid = 0;
        let yearPrincipalPaid = 0;
        let yearInterestPaid = 0;
        for (let month = 1; month <= 12; month++) {
            if (balance <= 0) break;

            const interest = balance * periodicRate;
            const principal = monthlyPayment - interest;
            yearTotalPaid += monthlyPayment;
            yearPrincipalPaid += principal;
            yearInterestPaid += interest;

            balance -= principal;
            if (balance < 0) balance = 0;

            totalPaid += monthlyPayment;
            principalPaid += principal;
            interestPaid += interest;
        }

        years.push(year);
        totalPaidData.push(yearTotalPaid);
        principalPaidData.push(yearPrincipalPaid);
        interestPaidData.push(yearInterestPaid);
        balanceData.push(balance);
    }

    return {
        years,
        totalPaidData,
        principalPaidData,
        interestPaidData,
        balanceData
    };
}

// Function to update the amortization schedule table and chart
function updateAmortizationSchedule() {
    const price = parseFloat(document.getElementById('price').value);
    const scenario = parseInt(document.getElementById('scenario').value);
    const amount = parseFloat(document.getElementById(`down-payment-amount-${scenario}`).value);
    const amortization = parseInt(document.getElementById(`amortization-${scenario}`).value);
    const rate = parseFloat(document.getElementById(`rate-${scenario}`).value);
    const frequency = document.getElementById(`frequency-${scenario}`).value;

    const {
        years,
        totalPaidData,
        principalPaidData,
        interestPaidData,
        balanceData
    } = generateAmortizationSchedule(price, amount, amortization, rate, frequency);

    const tableBody = document.getElementById('amortization-table').querySelector('tbody');
    tableBody.innerHTML = years.map((year, index) => `
        <tr>
            <td>${year}</td>
            <td>${formatNumber(totalPaidData[index])}</td>
            <td>${formatNumber(principalPaidData[index])}</td>
            <td>${formatNumber(interestPaidData[index])}</td>
            <td>${formatNumber(balanceData[index])}</td>
        </tr>
    `).join('');

    drawAmortizationChart(years, totalPaidData, principalPaidData, interestPaidData, balanceData);
}

// Format number as currency
function formatNumber(number) {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Call the function on scenario change and on page load
document.getElementById('scenario').addEventListener('change', updateAmortizationSchedule);
document.addEventListener('DOMContentLoaded', updateAmortizationSchedule);
