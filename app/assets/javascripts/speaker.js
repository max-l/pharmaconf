
var modalDialog = function(title, beforeShowFunc) {
                
  var c = $(Templates.ModalDialog({okButtonCaption: 'Fermer', title: title}))
              
  var modal = c.modal({backdrop: false}).data('modal')

  var closeFunc = function() {
    modal.hide()
    c.remove()                
  }
  
  beforeShowFunc(c, closeFunc)
  $('body').append(c)
}
        
var EcranConferencier = function() {
    var V = Backbone.View.extend({
    	el: $('body'),
    	events: {
    		"click .btnz": function(ev) {
    	       var btn = $(ev.currentTarget)
    	       var divId = btn.attr('data')
    	       var div = $('#'+divId)
    	       console.log(div.text())
    	       
    	       modalDialog('Table A', function(e) {
    	    	   var z = $('<div></div>')
    	    	   z.text(div.text())
    	    	   e.find('.modal-body').append(z)
    	       })
    	    }
    	},
        initialize: function() {
        },
        render: function() {
            return this
        }
	})
	return new V()
}

var ecranConferencier = EcranConferencier()

var POLL_DELAY = 3000

var poll = null 

poll = function() {
  $.ajax({
	  url: '/api/poll',
      type: 'GET',
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      success: function(res) {
        _.each(res, function(msg) {
        	var tableDiv = $('#'+msg.questionId + '-' + msg.tableId)
        	tableDiv.text(msg.text)
    	    //msg.ended
        })
      },
      error: function(err) {
      }	  
  })
  
  _.delay(poll, POLL_DELAY)
}


poll()
