

import {  formatNumber } from './options.js';

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
function generateAmortizationSchedule(price, amount, amortization, rate, frequency, appreciationRate) {
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
    let houseValue = price; // Initialize house value

    const years = [];
    const totalPaidData = [];
    const principalPaidData = [];
    const interestPaidData = [];
    const balanceData = [];
    const houseValueData = []; // Array to store house values

    for (let year = 1; year <= amortization; year++) {
        let yearTotalPaid = 0;
        let yearPrincipalPaid = 0;
        let yearInterestPaid = 0;

        // Update house value based on appreciation
        houseValue *= (1 + appreciationRate / 100);

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
        houseValueData.push(houseValue); // Store the house value for the year
    }

    return {
        years,
        totalPaidData,
        principalPaidData,
        interestPaidData,
        balanceData,
        houseValueData
    };
}


// Function to update the amortization schedule table and chart
export function updateAmortizationSchedule() {
    const price = parseFloat(document.getElementById('price').value);
    const scenario = parseInt(document.getElementById('scenario').value);
    const amount = parseFloat(document.getElementById(`down-payment-amount-${scenario}`).value);
    const amortization = parseInt(document.getElementById(`amortization-${scenario}`).value);
    const rate = parseFloat(document.getElementById(`rate-${scenario}`).value);
    const frequency = document.getElementById(`frequency-${scenario}`).value;
    const appreciationRate = parseFloat(document.getElementById('yearly-appreciation').value) || 0;

    const {
        years,
        totalPaidData,
        principalPaidData,
        interestPaidData,
        balanceData,
        houseValueData
    } = generateAmortizationSchedule(price, amount, amortization, rate, frequency, appreciationRate);

    const tableBody = document.getElementById('amortization-table').querySelector('tbody');
    tableBody.innerHTML = years.map((year, index) => `
        <tr>
            <td>${year}</td>
            <td>${formatNumber(totalPaidData[index])}</td>
            <td>${formatNumber(principalPaidData[index])}</td>
            <td>${formatNumber(interestPaidData[index])}</td>
            <td>${formatNumber(balanceData[index])}</td>
            <td>${formatNumber(houseValueData[index])}</td> <!-- New House Value Column -->
        </tr>
    `).join('');

    drawAmortizationChart(years, totalPaidData, principalPaidData, interestPaidData, balanceData);
}
