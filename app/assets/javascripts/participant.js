
function init(tableId) {
    
    var textBox = $('#textBox')
    
    var sendChanges = function() {
      $.ajax({
    	  url: '/api/update/' + tableId,
          type: 'PUT',
          data: textBox.val(),
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          success: function(res) {
          },
          error: function(err) {
          }	  
      })
    }
    
    textBox.keyup(_.throttle(sendChanges, 2000))
    
}