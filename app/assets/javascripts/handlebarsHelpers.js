
!function() { 

    var handlebarsTemplates = $("script[type='text/x-handlebars-template']");
    Templates = {};

    handlebarsTemplates.each(function(i, templateElement) {
      var t0 = $(templateElement);
      var t = Handlebars.compile(t0.html());
      Templates[t0.attr('id')] = t
    })

    var compiledTemplates = Templates;
      
    Handlebars.registerHelper('applyTemplate', function(subTemplateId,ctx){

    	var subTemplate = compiledTemplates[subTemplateId];

        var innerContent = ctx.fn(this);
        var subTemplateArgs = _.extend({}, 
          ctx.hash, 
          {content: new Handlebars.SafeString(innerContent)});

        return subTemplate(subTemplateArgs)
    })
    
    
    Handlebars.registerHelper('ifNot', function(conditional, options) {
      if(! conditional) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

parts = {
  'A': 'Jean Pierre Fisette, Raoul Espinoza, Lise Brisebois',
  'B': 'Paul Plourde, Richard Gourde, Xiaoyu Zong',
  'C': 'Abdelkarim Abu-Zafar, Réjean Paquette, Pauline Bilodeau',
  'D': 'Deng Thieu Tran, Ronald McDonnel, Gilles Plourde',
  'E': 'Eric Bastin,Jeanne Mance, Lise Touchette'
}    
}()