define(["backbone","handlebars","underscore","marionette","text!templates/account/creditcard_layout.html","views/account/new_card_view","views/account/stored_cards_view"],function(e,t,n,r,i,s,o){var u=e.Marionette.Layout.extend({className:"clear white_background",attributes:{id:"content"},template:t.compile(i),regions:{storedCards:"#stored-cards",newCard:"#new-card"},initialize:function(){this.render()},onRender:function(){this.model.get("cards").fetch(),this.newCard.show(new s({user:this.model})),this.storedCards.show(new o({collection:this.model.get("cards")}))}});return u});