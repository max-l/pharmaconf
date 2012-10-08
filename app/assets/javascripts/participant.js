
function init(tableId, jsonState) {

	var Questionnaire = function(el) {
		
		var boiler = function(subject) {
	      return "Pourriez-vous établir par ordre de priorité les sujets en "+subject+" dont vous aimeriez assister à une formation?"
        }
		
		var q = [		         
		   {question: 'Pourriez-vous établir par ordre de priorité les champs thérapeutiques qui vous intéressent ?',
			answers: ['Pédiatrie','Rhumatologie','Santé femme','Psychiatrie','Dermatologie','Cardiologie','Autres']
		   },
		   {question: boiler('PÉDIATRIE'),
		    answers: ["Nutrition","Infections","Maladies contagieuses","Vaccin","Autres"]
		   },
		   {question: boiler('RHUMATOLOGIE'),
		    answers: ["Arthrite rhumatoïde","Psoriasis","Fibromyalgie", "Autres"]
		   },
		   {question: boiler('PSYCHIATRIE'),
		    answers: ["Schizophrénie","Dépression","Anxiété généralisée TAG /phobie sociale","TDAH", "Autres"]
		   },
		   {question: boiler('DERMATOLOGIE'),
		    answers: ["Cancer de la peau","Psoriasis","Dermatologie pédiatrique","Cosmétique","Autres"]
		   },
		   {question: boiler('CARDIOLOGIE'),
		    answers: ["Hypertension","Troubles du rythme","Angine","Autres"]
		   }		   
		] 

		var q0 = $(Templates.introQuestionnaire("Veuillez répondre à un court questionnaire d'ici à ce que reprenne la conférence"))
		
		var qcm = function(i) {return $(Templates.choixMultiplesOrd(q[i]))}
		var q1 = qcm(0)
		var q2 = qcm(1)
		var q3 = qcm(2)
		
		var qs = [q0, 
		          qcm(0), qcm(1), qcm(2), qcm(3), qcm(4), qcm(5),
		          $(Templates.introQuestionnaire("Merci d'avoir répondu aux question, bonne conférence !"))]
		
		var step = 0

	    var V = Backbone.View.extend({
	    	el: el,
	        initialize: function() {
	        	this.render()
	        },
	    	events: {
	    		"click #next": function(ev) {
	        	   step = step + 1
	        	   this.render()
	    		},
	    		"click #prev": function(ev) {
		           step = step - 1
		           this.render()
		    	},
	    		"click #close": function(ev) {
		           step = 0
		           this.hide()
		           this.render()
		           $('#termine').trigger('click')
		    	}	    		
	        },
	        render: function() {
	        	var e = $(this.el)
	        	e.empty()
	        	e.append($("<div id='pan'></div>"))
	        	
	        	this.$('#pan').html(qs[step])
	        	
	        	if(step == 0) {
	        		e.append($("<a id='next' class='btn btn-primary btn-large'>Débuter le questionnaire</a>"))
	        	}
	        	else if(step == 1) {
	        		e.append($("<a id='next' class='btn btn-primary'>Question suivante >></a>"))
	        	}	        	
	        	else if(step == (qs.length -1)) {
	        		e.append($("<a id='close' class='btn'>Fermer</a>"))
	        	}
	        	else {	        		
	        		e.append($("<a id='next' class='btn btn-primary'>Question suivante >></a>"))
	        		e.append($("<a id='prev' class='btn'>&lt;&lt; Question précédente</a>"))
	        	}
	        	
                return this
	        },
	        hide: function() {
	        	$(this.el).hide()
	        },
	        show: function() {
	        	$(this.el).show()
	        }	        
	        
		})

		return new V()	
	}

	var qbox = Questionnaire($('#qbox'))
	qbox.hide()

	var EcranPharmacien = function() {
		
		var isPaused = false

        var sendChangesFunc = function(qId) {
          var aTextArea = $('#a-textBox' + qId)
          var rTextArea = $('#r-textBox' + qId)
          return _.throttle(function() {
        	  var msg = {
        	      questionId: qId, 
        	      tableId: tableId,
        	      text: aTextArea.val(),
        	      rational: rTextArea.val(),
        	      ended: isPaused
        	  }
              $.ajax({
            	  url: '/pc/api/update',
                  type: 'PUT',
                  data: JSON.stringify(msg),
                  dataType: 'json',
                  contentType: "application/json; charset=utf-8",
                  success: function(res) {
                  },
                  error: function(err) {
                	  //TODO: send error log
                  }
              })
            }, 3000)
        }
        
        var sendFunc1 = sendChangesFunc(1)
        var sendFunc2 = sendChangesFunc(2)
        var sendFunc3 = sendChangesFunc(3)		

        var currentQuestionId = 1

        var notifyPaused = function() {
        	if(currentQuestionId == 1)
        		sendFunc1()
        	else if(currentQuestionId == 2)
        		sendFunc2()
        	else if(currentQuestionId == 3)
        		sendFunc3()
        }

	    var V = Backbone.View.extend({
	    	el: $('body'),
	    	events: {
	    	
	    	    "keyup #a-textBox1": function() {sendFunc1()},
	    	    "keyup #a-textBox2": function() {sendFunc2()},
	    	    "keyup #a-textBox3": function() {sendFunc3()},
	    	    
	    	    "keyup #r-textBox1": function() {sendFunc1()},
	    	    "keyup #r-textBox2": function() {sendFunc2()},
	    	    "keyup #r-textBox3": function() {sendFunc3()},
	    	    
	    	    "click #sceance1": function(ev) {currentQuestionId = 1},
	    	    "click #sceance2": function(ev) {currentQuestionId = 2},
	    	    "click #sceance3": function(ev) {currentQuestionId = 3},
	    	    
	    		"click #termine": function(ev) {
	    	      if(!isPaused) {
	    	         $(ev.currentTarget).text('Continuer la rédaction (retour à la conférence)')
	    	         //$('textarea').attr('disabled',true)
	    	         $('#qpan').hide("slow")
	    	         qbox.show()
	    	         isPaused = true
	    	         notifyPaused()//just to send isPaused
	    	         return
	    	      }
	    	      
	    	      $(ev.currentTarget).text('redaction terminée')
	    	      //$('textarea').removeAttr('disabled')
	    	      $('#qpan').show("slow")
	    	      qbox.hide()
	    	      isPaused = false
	    	      notifyPaused()//just to send isPaused
	    	    }
	    	},
	        initialize: function() {
	    		this.render()
	        },
	        render: function() {

	        	var f = function(i) {

	        		var q = _.find(jsonState, function(q) {return q.questionId == i})

	        		if(q) {
	        		  this.$('#a-textBox'+i).text(q.text)
	        		  this.$('#r-textBox'+i).text(q.rational)
	        		}
	        	}

	        	f(1)
	        	f(2)
	        	f(3)

                return this
	        }
		})

		return new V()	
	}
	
	EcranPharmacien()
}