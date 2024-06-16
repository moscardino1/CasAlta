from flask import Flask, render_template, request
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/results', methods=['POST'])
def results():
    mq = float(request.form['mq'])
    price = float(request.form['price'])
    years = int(request.form['years'])
    upfront_percentage = float(request.form['upfront'])
    int_rate = float(request.form['int_rate'])
    rent_per_night = float(request.form['rent_per_night'])
    
    # Extract pre-compiled values for occupancy and expenses forecast
    occupancy = [0.2, 0.0, 0.0, 0.2, 0.0, 0.7, 0.7, 0.0, 0.7, 0.7, 0.2, 0.2]  # Example data
    monthly_expenses = {
        'taxes': 60,
        'cleaning': 60,
        'bills': 60
    }

    # Calculations based on the spreadsheet logic
    upfront = price * upfront_percentage / 100
    loan_amount = price - upfront
    monthly_interest_rate = int_rate / 100 / 12
    num_payments = years * 12
    monthly_payment = loan_amount * (monthly_interest_rate * (1 + monthly_interest_rate) ** num_payments) / ((1 + monthly_interest_rate) ** num_payments - 1)
    
    yearly_revenue = sum([occupancy[i] * 30 * rent_per_night for i in range(12)])
    yearly_expenses = sum(monthly_expenses.values()) * 12
    
    profit_before_tax = yearly_revenue - yearly_expenses
    # Additional financial calculations can be added here
    
    results = {
        'monthly_payment': monthly_payment,
        'yearly_revenue': yearly_revenue,
        'yearly_expenses': yearly_expenses,
        'profit_before_tax': profit_before_tax
    }
    
    return render_template('results.html', results=results)

if __name__ == '__main__':
    app.run(debug=True)
