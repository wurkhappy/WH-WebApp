define(["backbone","handlebars","underscore","marionette","moment","text!templates/agreement/status_item_tpl.html","views/agreement/comment_view"],function(e,t,n,r,i,s,o){var u=e.Marionette.CompositeView.extend({template:t.compile(s),tagName:"li",className:"agreement_history_items",itemView:o,itemViewContainer:".comments-container",events:{"keypress input":"addComment"},initialize:function(){this.collection=this.model.get("comments")},addComment:function(e){if(e.keyCode==13){var t=new this.collection.model({text:e.target.value,dateCreated:i(),authorID:window.thisUser.id});this.collection.add(t),this.model.save(),e.target.value=null}}});return u});