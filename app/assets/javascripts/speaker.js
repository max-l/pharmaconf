
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
	
	var closePrevWindow = function(){}

    var V = Backbone.View.extend({
    	el: $('body'),
    	events: {
    	    "click #btnCloseDialog": function() {closePrevWindow()},
    		"click .btnz": function(ev) {
    	       var btn = $(ev.currentTarget)
    	       var sceanceId = btn.attr('sceanceId')
    	       var tableId = btn.attr('tableId')
    	       var divId = sceanceId + '-' + tableId
    	       var div = $('#'+divId)
    	       //console.log(div.text())
    	       
    	       modalDialog('Table ' + tableId, function(e, closeFunc) {
    	    	   closePrevWindow()
    	    	   closePrevWindow = closeFunc
    	    	   var z = $('<div></div>')
    	    	   z.text(div.text())
    	    	   e.find('.modal-body').append(z)
    	    	   var footer = e.find('.modal-footer')
    	    	   _.each(['A','B','C','D','E'], function(tId) {
    	    		   var b = $("<a class='btnz btn'>"+tId+"</a>")
    	    		   b.attr('tableId', tId)
    	    		   b.attr('sceanceId', sceanceId)
    	    		   //b.addClass('a-' + sceanceId + '-' + tId)
    	    		   var otherBtn = $('.a-' + sceanceId + '-' + tId)
    	    		   if(otherBtn.hasClass('btn-danger'))
    	    			   b.addClass('btn-danger')
    	    		   else if(otherBtn.hasClass('btn-success'))
    	    			   b.addClass('btn-success')
    	    		   footer.append(b)
    	    	   })
    	    	   footer.append($("<a id='btnCloseDialog' class='btn btn-primary'>Fermer</a>"))
    	    	   //to collor the buttons :
    	    	   //processMsg(lastMsg)
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

var lastMsg = []

var processMsg = function(res) {
    _.each(res, function(msg) {
    	lastMsg = msg
    	var id = msg.questionId + '-' + msg.tableId
    	var tableDiv = $('#'+ id)
    	tableDiv.text(msg.text)
    	var btn = $('.a-' + id)
    	if(msg.ended) {
    		btn.removeClass('btn-success')
    		btn.addClass('btn-danger')
    	}
    	else {
    		btn.addClass('btn-success')
    		btn.removeClass('btn-danger')
    	}
    		
	    
    })	
}

poll = function() {
  $.ajax({
	  url: '/pc/api/poll',
      type: 'GET',
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      success: processMsg,
      error: function(err) {
      }	  
  })
  
  _.delay(poll, POLL_DELAY)
}


poll()
