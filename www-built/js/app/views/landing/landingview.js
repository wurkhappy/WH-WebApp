define(["backbone","handlebars","jquery","parsley","views/landing/loginview","hbs!templates/landing/landingview"],function(e,t,n,r,i,s){var o=e.View.extend({el:"#intro",template:s,render:function(){return n(this.el).html(this.template()),this}});return o});