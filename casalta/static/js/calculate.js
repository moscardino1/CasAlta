function calculate() {
    let formData = {
        mq: $('#mq').val(),
        price: $('#price').val(),
        years: $('#years').val(),
        upfront: $('#upfront').val(),
        int_rate: $('#int_rate').val(),
        rent_per_night: $('#rent_per_night').val(),
        occupancy: $('#occupancy').val(),
        taxes: $('#taxes').val(),
        cleaning: $('#cleaning').val(),
        bills: $('#bills').val(),
        rent_per_night: $('#rent_per_night').val(),
        input_currency: $('#input_currency').val(),
        output_currency: $('#output_currency').val(),
        exchange_rate: $('#exchange_rate').val(),
        couple: $('#couple').is(':checked') ? 'yes' : 'no',
        renovation_cost: $('#renovation_cost').val(),
        furniture_cost: $('#furniture_cost').val(),
        appreciation_rate: $('#appreciation_rate').val()
    };
    $.ajax({
        type: 'POST',
        url: '/calculate',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
            updateResults(response);
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', error);
        }
    });
}