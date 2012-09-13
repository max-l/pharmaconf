

var modalDialog = function(title, beforeShowFunc, tableId) {

  var c = $(Templates.ModalDialog({
	  okButtonCaption: 'Fermer', 
	  title: title,
	  participants: parts[tableId]
	}))

  var modal = c.modal({backdrop: false}).data('modal')

  var closeFunc = function() {
	modalBody = null
	modalQid = null	  
    modal.hide()
    c.remove()
  }

  beforeShowFunc(c, closeFunc)
  $('body').append(c)
}

var modalQid = null
var modalBody = null

var EcranConferencier = function() {
	
	var closePrevWindow = function(){}

    var V = Backbone.View.extend({
    	el: $('body'),
    	events: {
    	    "click #btnCloseDialog": function() {closePrevWindow()},
    	    "click .tableView": function(ev) {
    	    	ev.preventDefault()
    	    	var b = $(ev.currentTarget).find('a.btnz')
    	    	ev.stopPropagation()
    	        var btn = $(ev.currentTarget)
    	        var sceanceId = btn.attr('sceanceId')
    	        var tableId = btn.attr('tableId')
    	        this.pop(sceanceId, tableId)
    	    },
    		"click .btnz, .btnzB": function(ev) {
    	       ev.stopPropagation()
    	       var btn = $(ev.currentTarget)
    	       var sceanceId = btn.attr('sceanceId')
    	       var tableId = btn.attr('tableId')
    	       this.pop(sceanceId, tableId)
    		}
    	},
    	pop: function(sceanceId, tableId) {

 	        var divId = sceanceId + '-' + tableId
 	        modalQid = divId
	       
            var msg = tableMsgMap[divId]
            
            modalDialog('Table ' + tableId, function(e, closeFunc) {
            	   closePrevWindow()
            	   closePrevWindow = closeFunc
            
            	   modalBody = e.find('.modal-body')
            	   modalBody.append($(Templates.PharmaMessage(msg)))
            	   
            	   var footer = e.find('.modal-footer')
            	   _.each(['A','B','C','D','E'], function(tId) {
            		   var b = $("<a class='btn btnzB'>"+tId+"</a>")
            		   b.attr('tableId', tId)
            		   b.attr('sceanceId', sceanceId)

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
            }, tableId)
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
               
var tableMsgMap = {}

var processMsg = function(res) {
    _.each(res, function(msg) {
    	lastMsg = msg    	
    	var id = msg.questionId + '-' + msg.tableId

    	tableMsgMap[id] = msg

    	if(modalQid && modalQid == id) {
    		modalBody.empty()
    		modalBody.append($(Templates.PharmaMessage(msg)))
    	}

    	var tableDiv = $('#'+ id)
    	tableDiv.empty()
    	tableDiv.append($(Templates.PharmaMessage(msg)))
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
      error: function(err) {}
  })
  
  _.delay(poll, POLL_DELAY)
}


poll()
