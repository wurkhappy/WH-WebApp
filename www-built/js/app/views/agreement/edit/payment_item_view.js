define(["backbone","handlebars","underscore","marionette","kalendae","text!templates/agreement/edit/payment_item_tpl.html","views/agreement/edit/scope_item_view"],function(e,t,n,r,i,s,o){t.registerHelper("dateFormat",function(e){return e.format("MMM D, YYYY")});var u=e.Marionette.CompositeView.extend({template:t.compile(s),itemView:o,itemViewContainer:".scope_items_container",initialize:function(){this.collection=this.model.get("scopeItems")},events:{"blur .amount":"updateAmount","blur .title":"updateTitle","click #remove_icon":"removeMilestone","keypress .edit_work_item":"addScopeItem","click .add_comment":"addComment","focus .kal":"triggerCalender","focus input":"fadeError"},updateAmount:function(e){var t=e.target.value,n=t.substring(0,1)==="$"?t.substring(1):t;this.model.set("amount",n)},updateTitle:function(e){this.model.set("title",e.target.value)},removeMilestone:function(){this.model.collection.remove(this.model)},addScopeItem:function(e){e.keyCode==13&&(this.collection.add({text:e.target.value}),e.target.value=null)},triggerCalender:function(e){this.calendar||(this.calendar=new i.Input(this.$(".kal")[0],{}),this.calendar.subscribe("date-clicked",n.bind(this.setDate,this)))},setDate:function(e,t){this.model.set("dateExpected",e),n.delay(this.closeCalendar,150),this.$(".kal").blur(),console.log(this.model),console.log(e.format("MMM D, YYYY")),console.log(this.model.get("dateExpected").format("MMM D, YYYY")),console.log(this.model.get("dateExpected").format("MMM D, YYYY"))},closeCalendar:function(){$(".kalendae").hide()},addComment:function(e){var t=$(e.target).prev(".add_work_item_input"),n=$("input"),r=$(e.target).next(".add_work_item_error");t.val()===""?(r.fadeIn("fast"),n.keypress(function(){$(".add_work_item_error").fadeOut("fast")}),t.focus()):(this.collection.add({text:t.val()}),t.val(null),t.focus())},fadeError:function(e){$(".add_work_item_error").fadeOut("fast")}});return u});