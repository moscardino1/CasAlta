function updateResults(response) {
    // Format the numbers using toLocaleString()
     
        const inputCurrencyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: response.input_currency,
            minimumFractionDigits: 2
        });
    
        const outputCurrencyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: response.output_currency,
            minimumFractionDigits: 2
        });
    
        // Add a formatter for per person values
        const perPersonFormatter = (value) => {
            if (response.couple) {
                return inputCurrencyFormatter.format(value / 2);
            } else {
                return '';
            }
        };

    $('#resultsContainer').html(`
         <div class="row">
            <div class="col-md-12">
                <div class="cluster-box">
                    <h3>Loan Details</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>${response.input_currency}</th>
                                <th>${response.output_currency}</th>
                                ${response.couple ? '<th>Per Person (Input Currency)</th><th>Per Person (Output Currency)</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Upfront Payment</td>
                                <td>${inputCurrencyFormatter.format(response.upfront)}</td>
                                <td>${outputCurrencyFormatter.format(response.output_upfront)}</td>
                                ${response.couple ? `<td>${perPersonFormatter(response.upfront)}</td><td>${outputCurrencyFormatter.format(response.output_upfront / 2)}</td>` : ''}
                            </tr>
                            <tr>
                                <td>Loan Amount</td>
                                <td>${inputCurrencyFormatter.format(response.loan_amount)}</td>
                                <td>${outputCurrencyFormatter.format(response.output_loan_amount)}</td>
                                ${response.couple ? `<td>${perPersonFormatter(response.loan_amount)}</td><td>${outputCurrencyFormatter.format(response.output_loan_amount / 2)}</td>` : ''}
                            </tr>
                            <tr>
                                <td>Monthly Interest Rate</td>
                                <td>${(response.monthly_interest_rate * 100).toFixed(2)}%</td>
                                <td>${(response.monthly_interest_rate * 100).toFixed(2)}%</td>
                                ${response.couple ? `<td></td><td></td>` : ''}
                            </tr>
                            <tr>
                                <td>Number of Payments</td>
                                <td>${response.num_payments}</td>
                                <td>${response.num_payments}</td>
                                ${response.couple ? `<td></td><td></td>` : ''}
                            </tr>
                            <tr>
                                <td>Monthly Payment</td>
                                <td>${inputCurrencyFormatter.format(response.monthly_payment)}</td>
                                <td>${outputCurrencyFormatter.format(response.output_monthly_payment)}</td>
                                ${response.couple ? `<td>${perPersonFormatter(response.monthly_payment)}</td><td>${outputCurrencyFormatter.format(response.output_monthly_payment / 2)}</td>` : ''}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="cluster-box">
                    <h3>Revenue and Expenses</h3>
                    <table class="table">
                        <tr>
                            <th></th>
                            <th>${response.input_currency}</th>
                            <th>${response.output_currency}</th>
                            ${response.couple ? '<th>Per Person (Input Currency)</th><th>Per Person (Output Currency)</th>' : ''}

                        </tr>
                        <tr><td>Yearly Revenue</td><td>${inputCurrencyFormatter.format(response.yearly_revenue)}</td><td>${outputCurrencyFormatter.format(response.output_yearly_revenue)}</td> ${response.couple ? `<td>${perPersonFormatter(response.yearly_revenue)}</td><td>${outputCurrencyFormatter.format(response.output_yearly_revenue / 2)}</td>` : ''}</tr>
                        <tr><td>Yearly Expenses</td><td>${inputCurrencyFormatter.format(response.yearly_expenses)}</td><td>${outputCurrencyFormatter.format(response.output_yearly_expenses)}</td>${response.couple ? `<td>${perPersonFormatter(response.yearly_expenses)}</td><td>${outputCurrencyFormatter.format(response.output_yearly_expenses / 2)}</td>` : ''}</tr>
                        <tr><td>Profit Before Tax</td><td>${inputCurrencyFormatter.format(response.profit_before_tax)}</td><td>${outputCurrencyFormatter.format(response.output_profit_before_tax)}</td>${response.couple ? `<td>${perPersonFormatter(response.profit_before_tax)}</td><td>${outputCurrencyFormatter.format(response.output_profit_before_tax / 2)}</td>` : ''}</tr>
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="cluster-box">
                    <h3>House Value Over Years</h3>
                    <table class="table">
                        <tr>
                            <th>Year</th>
                            <th>${response.input_currency}</th>
                            <th>${response.output_currency}</th>
 
                        </tr>
                        ${response.house_value_over_years.map((value, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${inputCurrencyFormatter.format(value)}</td>
                                <td>${outputCurrencyFormatter.format(response.output_house_value_over_years[index])}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="cluster-box">
                    <h3>Costs including Renovation and Furniture</h3>
                    <table class="table">
                        <tr>
                            <th></th>
                            <th>${response.input_currency}</th>
                            <th>${response.output_currency}</th>
                            ${response.couple ? '<th>Per Person (Input Currency)</th><th>Per Person (Output Currency)</th>' : ''}

                        </tr>
                        <tr><td>House Price</td><td>${inputCurrencyFormatter.format(response.price)}</td><td>${outputCurrencyFormatter.format(response.output_price)}</td> ${response.couple ? `<td>${perPersonFormatter(response.price)}</td><td>${outputCurrencyFormatter.format(response.output_price / 2)}</td>` : ''}</tr>
                        <tr><td>Renovation Cost</td><td>${inputCurrencyFormatter.format(response.renovation_cost)}</td><td>${outputCurrencyFormatter.format(response.output_renovation_cost)}</td> ${response.couple ? `<td>${perPersonFormatter(response.renovation_cost)}</td><td>${outputCurrencyFormatter.format(response.output_renovation_cost / 2)}</td>` : ''}</tr>
                        <tr><td>Furniture Cost</td><td>${inputCurrencyFormatter.format(response.furniture_cost)}</td><td>${outputCurrencyFormatter.format(response.output_furniture_cost)}</td> ${response.couple ? `<td>${perPersonFormatter(response.furniture_cost)}</td><td>${outputCurrencyFormatter.format(response.output_furniture_cost / 2)}</td>` : ''}</tr>
                        <tr><th>Total Cost</th><td>${inputCurrencyFormatter.format(response.total_cost)}</td><td>${outputCurrencyFormatter.format(response.output_total_cost)}</td> ${response.couple ? `<td>${perPersonFormatter(response.total_cost)}</td><td>${outputCurrencyFormatter.format(response.output_total_cost / 2)}</td>` : ''}</tr>
                    </table>
                </div>
            </div>
        </div>
    `);
}
// Trigger calculation on input change
$('#simulationForm input, #simulationForm select').on('input change', function () {
    calculate();
});

// Initial calculation on page load
$(document).ready(function () {
    calculate();
});
