$(document).ready(function(){
  $("#from_value").priceFormat({
    prefix: '',
    thousandsSeparator: ''
  });
  
  $("#from_value").keypress(function(e){
    
                     //Numeral keys
    var to_return =  (e.which >= 48 && e.which <= 57) || 
                     //Backspace
                     (e.which == 8) || 
                     //Delete
                     (e.keyCode == 46) || 
                     (e.key === 'End')   || (e.key === 'Home') ||
                      //Arrows
                     (e.keyCode >= 37 && e.keyCode <= 40) ? true : false;
    return to_return;
  });
  
  $("#swap").click(function(){
    var from_currency_index = $("#from_currency")[0].selectedIndex;
    var to_currency_index = $("#to_currency")[0].selectedIndex;
    
    i = 0;
    $('#from_currency > option').each(function(){
      if(i++ == to_currency_index){
        $(this).prop('selected', true);
      }
    });
    
    i = 0;
    $('#to_currency > option').each(function(){
      if(i++ == from_currency_index){
        $(this).prop('selected', true);
      }
    });
  })
  
  $("#convert-button").click(function(){
    validate();
  });
});

var getJSON = function(url, successHandler, errorHandler){
  var xhr = new XMLHttpRequest({mozSystem: true});
  xhr.open('get', url, true);
  xhr.onreadystatechange = function() {
    var status;
    var data;
    
    if (xhr.readyState == 4) { // `DONE`
      status = xhr.status;
      if (status == 200) {
        data = JSON.parse(xhr.responseText);
        successHandler && successHandler(data);
      } else {
        errorHandler && errorHandler(status);
      }
    }
  };
  xhr.send();  
};

var validate = function(){
  $("#convert-button").blur();
  
  var from_currency = $("#from_currency").val();
  var to_currency = $("#to_currency").val();
  var query_var = from_currency + to_currency;
  var query = 'select * from yahoo.finance.xchange where pair in ("' + query_var + '")';
  var env   = 'store://datatables.org/alltableswithkeys';
  var address   = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + '&format=json&env=' + encodeURIComponent(env);
  
  getJSON(address, function(result){
    $("#error").attr("hidden", true);
    var from_value = parseFloat($("#from_value").val());
    var total = from_value * parseFloat(result.query.results.rate.Bid);
    $("#to_value").val(total.toFixed(2));
  }, function(status) {
    $("#error").attr("hidden", false);
  });
  
};