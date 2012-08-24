
var POLL_DELAY = 3000

var poll = null 
	
poll = function() {
  $.ajax({
	  url: '/api/poll',
      type: 'GET',
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      success: function(res) {
	  
        for(var tableId in res) {
          $('#' + tableId).text(res[tableId])
        }
      },
      error: function(err) {
      }	  
  })
  
  _.delay(poll, POLL_DELAY)
}


poll()