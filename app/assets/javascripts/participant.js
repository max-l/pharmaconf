
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
		          qcm(0),qcm(1),qcm(2),qcm(3),qcm(4),qcm(5),
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
		    	}	    		
	        },
	        render: function() {
	        	var e = $(this.el)
	        	e.empty()
	        	e.append($("<div id='pan'></div>"))
	        	
	        	this.$('#pan').html(qs[step])
	        	
	        	if(step == 0) {
	        		e.append($("<a id='next' class='btn btn-primary'>Débuter le questionnaire</a>"))
	        	}
	        	else if(step == 1) {
	        		e.append($("<a id='next' class='btn btn-primary'>Question suivante</a>"))
	        	}	        	
	        	else if(step == (qs.length -1)) {
	        		e.append($("<a id='close' class='btn'>Fermer</a>"))
	        	}
	        	else {
	        		e.append($("<a id='prev' class='btn'>Question précédente</a>"))
	        		e.append($("<a id='next' class='btn btn-primary'>Question suivante</a>"))
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
		
	    var V = Backbone.View.extend({
	    	el: $('body'),
	    	events: {
	    		"click #termine": function(ev) {
	    	      if(!isPaused) {
	    	         $(ev.currentTarget).text('continuer la rédaction')
	    	         $('textarea').attr('disabled',true)
	    	         qbox.show()
	    	         isPaused = true
	    	         return
	    	      }
	    	      
	    	      $(ev.currentTarget).text('redaction terminée')
	    	      $('textarea').removeAttr('disabled')
	    	      qbox.hide()
	    	      isPaused = false
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
	
	EcranPharmacien()
	
	//qbox.show()
}