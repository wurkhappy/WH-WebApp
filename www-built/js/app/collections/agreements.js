define(["backbone","models/agreement"],function(e,t){var n=e.Collection.extend({model:t,sortByStatus:function(){var e=new n,t=new n,r=new n;return this.each(function(n){if(n.get("draft")){r.add(n);return}var i=n.get("currentStatus");switch(i.get("action")){case i.StatusSubmitted:e.add(n);break;default:t.add(n)}}),{waitingOnRespAgrmnts:e,inProgressAgrmnts:t,draftAgrmnts:r}}});return n});