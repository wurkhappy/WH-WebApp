define(["backbone","handlebars","underscore","marionette","text!templates/create_agreement/estimate_tpl.html","views/create_agreement/milestone_view"],function(e,t,n,r,i,s){var o=e.Marionette.CompositeView.extend({className:"clear white_background",attributes:{id:"content"},template:t.compile(i),itemView:s,initialize:function(e){this.router=e.router},events:{"click #addMoreButton":"addMilestone","click .submit-buttons > a":"saveAndContinue","mouseenter .create_agreement_navigation_link":"mouseEnterNavigation","mouseleave .create_agreement_navigation_link":"mouseLeaveNavigation","click .create_agreement_navigation_link":"showPage"},appendHtml:function(e,t,n){t.$el.insertBefore(e.$("#addMoreButton"))},addMilestone:function(e){this.collection.add({})},saveAndContinue:function(e){e.preventDefault(),e.stopPropagation(),this.model.save({},{success:n.bind(function(e,t){window.location.hash="review"},this)})},showPage:function(e){e.preventDefault(),e.stopPropagation(),$(e.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");var t=$(e.currentTarget).attr("href");this.model.save({},{success:n.bind(function(e,n){window.location.hash=t},this)})},mouseEnterNavigation:function(e){$(e.currentTarget).find("h2").addClass("create_agreement_navigation_link_hover")},mouseLeaveNavigation:function(e){$(e.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover")}});return o});