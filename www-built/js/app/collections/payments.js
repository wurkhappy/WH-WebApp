define(["backbone","models/payment"],function(e,t){var n=e.Collection.extend({model:t,getTotalAmount:function(){return this.reduce(function(e,t){return e+t.get("amount")},0)},findSubmittedPayment:function(){var e=this.filter(function(e){return e.get("currentStatus")&&e.get("currentStatus").get("action")==="submitted"});return e[0]},findFirstOutstandingPayment:function(){var e=this.filter(function(e){return!e.get("currentStatus")||e.get("currentStatus").get("action")!=="accepted"});return e[0]},findAllOutstandingPayment:function(){var e=this.filter(function(e){return!e.get("currentStatus")||e.get("currentStatus").get("action")!=="accepted"});return new n(e)},getTotalPayments:function(){return this.length},getAcceptedPayments:function(){var e=this.filter(function(e){return e.get("currentStatus")!==null?e.get("currentStatus").get("action")==="accepted":0});return e.length},getNumberOfSubmittedPayments:function(){var e=this.filter(function(e){return e.get("currentStatus")&&e.get("currentStatus").get("action")==="submitted"});return e.length},getPercentComplete:function(){var e=this.getAcceptedPayments(),t=this.getTotalPayments();return e===0?0:e/t}});return n});