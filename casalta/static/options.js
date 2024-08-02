export const optionCount = 4;

export function formatNumber(number) {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function createOptionElement(index) {
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
