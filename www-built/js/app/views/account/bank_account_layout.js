define(["backbone","handlebars","underscore","marionette","text!templates/account/bank_account_layout.html","views/account/new_bank_account_view","views/account/stored_bank_accounts_view"],function(e,t,n,r,i,s,o){t.registerHelper("last_four_digits",function(e){if(!e)return;return e.slice(-4)});var u=e.Marionette.Layout.extend({className:"clear white_background",attributes:{id:"content"},template:t.compile(i),regions:{bankAccounts:"#stored-accounts",newBankAccount:"#new-account"},initialize:function(){this.render()},onRender:function(){this.model.get("bank_accounts").fetch(),this.newBankAccount.show(new s({user:this.model})),this.bankAccounts.show(new o({collection:this.model.get("bank_accounts")}))}});return u});