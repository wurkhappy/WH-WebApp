/*
* Agreements Collection.
*/

define(['backbone', 'models/agreement'],

      function(Backbone, Model) {

            'use strict';

            var Collection = Backbone.Collection.extend({
                  model: Model,
                  comparator: function(model){
                        return -moment(model.get("lastModified")).valueOf();
                  },
                  sortByStatus: function(){
                        var waitingOnRespAgrmnts = new Collection();
                        var inProgressAgrmnts = new Collection();
                        var draftAgrmnts = new Collection();
                        this.each(function(model){
                              if (model.get("draft")){
                                    draftAgrmnts.add(model);
                                    return;
                              }
                              var status = model.get("currentStatus");
                              switch (status.get("action")){
                                    case status.StatusSubmitted:
                                    waitingOnRespAgrmnts.add(model);
                                    break;
                                    default:
                                    inProgressAgrmnts.add(model);
                              }
                        });
                        return {
                              waitingOnRespAgrmnts: waitingOnRespAgrmnts,
                              inProgressAgrmnts: inProgressAgrmnts,
                              draftAgrmnts: draftAgrmnts
                        };
                  },
                  findFreelancerAgreements: function(userID){
                        var agreementArray = this.filter(function(model){
                              return model.get("freelancerID") === userID;
                        });
                        return new Collection(agreementArray);
                  },
                  findClientAgreements: function(userID){
                        var agreementArray = this.filter(function(model){
                              return model.get("clientID") === userID;
                        });
                        return new Collection(agreementArray);
                  }

            });

return Collection;

});