define(["backbone","handlebars","underscore","marionette","text!templates/create_agreement/payment_scope_tpl.html","views/create_agreement/scope_item_view"],function(e,t,n,r,i,s){var o=e.Marionette.CompositeView.extend({className:"scopeWrapper",template:t.compile(i),itemView:s,itemViewContainer:"ul",events:{"keypress input":"addOnEnter","click .add_comment":"addComment"},addOnEnter:function(e){e.keyCode==13&&(this.collection.add({text:e.target.value}),e.target.value=null)},addComment:function(e){var t=$(e.target).prev(".add_work_item_input"),n=$("input"),r=$(e.target).next(".add_work_item_error");t.val()===""?(r.fadeIn("fast"),n.keypress(function(){$(".add_work_item_error").fadeOut("fast")}),t.focus()):(this.collection.add({text:t.val()}),t.val(null),t.focus())},fadeError:function(e){console.log("hello"),$(".add_work_item_error").fadeOut("fast")}});return o});