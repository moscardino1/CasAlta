from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    # Pre-filled default values
    default_values = {
        'mq': 70,
        'price': 450000,
        'years': 5,
        'upfront': 65,
        'int_rate': 3.20,
        'rent_per_night': 145,
        'occupancy': 1,
        'taxes': 60,
        'cleaning': 60,
        'bills': 60,
        'currency': 'EUR',
        'couple': 'yes',
        'renovation_cost': 10000,
        'furniture_cost': 5000,
        'appreciation_rate': 3.0
    }
    return render_template('index.html', default_values=default_values)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    mq = float(data['mq'])
    price = float(data['price'])
    years = int(data['years'])
    upfront_percentage = float(data['upfront'])
    int_rate = float(data['int_rate'])
    rent_per_night = float(data['rent_per_night'])
    occupancy = float(data['occupancy'])
    taxes = float(data['taxes'])
    cleaning = float(data['cleaning'])
    bills = float(data['bills'])
    input_currency = data['input_currency']
    output_currency = data['output_currency']
    exchange_rate = float(data['exchange_rate'])
    couple = data['couple'] == 'yes'
    renovation_cost = float(data['renovation_cost'])
    furniture_cost = float(data['furniture_cost'])
    appreciation_rate = float(data['appreciation_rate']) / 100
    if input_currency == output_currency:
        exchange_rate = 1.0
    else:
        exchange_rate = float(data['exchange_rate'])
    # Extract pre-compiled values for occupancy and expenses forecast
    occupancy =   occupancy  
    monthly_expenses = {
        'taxes': taxes,
        'cleaning': cleaning,
        'bills': bills
    }
    
    # Calculations
    upfront = price * upfront_percentage / 100
    loan_amount = price - upfront
    monthly_interest_rate = int_rate / 100 / 12
    num_payments = years * 12
    monthly_payment = loan_amount * (monthly_interest_rate * (1 + monthly_interest_rate) ** num_payments) / ((1 + monthly_interest_rate) ** num_payments - 1)
    
    yearly_revenue = (occupancy *12 * 30 * rent_per_night )
    yearly_expenses = sum(monthly_expenses.values()) * 12
    
    profit_before_tax = yearly_revenue - yearly_expenses
    
    # House value over years
    house_value_over_years = [price * ((1 + appreciation_rate) ** i) for i in range(1, years + 1)]
    
    # Costs including renovation and furniture
    total_cost = price + renovation_cost + furniture_cost
    # Calculate per person values if couple is selected
   

    output_monthly_payment = monthly_payment * exchange_rate
    output_yearly_revenue = yearly_revenue * exchange_rate
    output_yearly_expenses = yearly_expenses * exchange_rate
    output_profit_before_tax = profit_before_tax * exchange_rate
    output_upfront = upfront * exchange_rate
    output_loan_amount = loan_amount * exchange_rate
    output_house_value_over_years = [value * exchange_rate for value in house_value_over_years]
    output_renovation_cost = renovation_cost * exchange_rate
    output_furniture_cost = furniture_cost * exchange_rate
    output_total_cost = total_cost * exchange_rate
    output_price = price * exchange_rate

    results = {
    'monthly_payment': monthly_payment,
    'yearly_revenue': yearly_revenue,
    'yearly_expenses': yearly_expenses,
    'profit_before_tax': profit_before_tax,
    'input_currency': input_currency,
    'output_currency': output_currency,
    'exchange_rate': exchange_rate,
    'couple': couple,
    'upfront': upfront,
    'loan_amount': loan_amount,
    'monthly_interest_rate': monthly_interest_rate,
    'num_payments': num_payments,
    'mq': mq,
    'price': price,
    'years': years,
    'upfront_percentage': upfront_percentage,
    'int_rate': int_rate,
    'rent_per_night': rent_per_night,
    'house_value_over_years': house_value_over_years,
    'renovation_cost': renovation_cost,
    'furniture_cost': furniture_cost,
    'total_cost': total_cost,
    'output_monthly_payment': output_monthly_payment,
    'output_yearly_revenue': output_yearly_revenue,
    'output_yearly_expenses': output_yearly_expenses,
    'output_profit_before_tax': output_profit_before_tax,
    'output_upfront': output_upfront,
    'output_loan_amount': output_loan_amount,
    'output_house_value_over_years': output_house_value_over_years,
    'output_renovation_cost': output_renovation_cost,
    'output_furniture_cost': output_furniture_cost,
    'output_total_cost': output_total_cost,
    'output_price': output_price,
    'currency': input_currency  # Add this line
}
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
