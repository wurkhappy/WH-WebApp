define(["backbone","handlebars","text!templates/account/bankaccount.html"],function(e,t,n){var r=e.View.extend({className:"clear white_background",attributes:{id:"content"},template:t.compile(n),initialize:function(){this.render()},render:function(){return this.$el.html(this.template()),this}});return r});