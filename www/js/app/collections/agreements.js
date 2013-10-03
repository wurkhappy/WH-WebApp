/*
* Collection.
*/

define(['backbone', 'models/agreement'],

      function(Backbone, Model) {

            'use strict';

            var Collection = Backbone.Collection.extend({

                  model: Model,

                  sortByStatus: function(){
                        var waitingOnRespAgrmnts = new Collection();
                        var inProgressAgrmnts = new Collection();
                        var draftAgrmnts = new Collection();
                        this.each(function(model){
                              var status = model.get("statusHistory").at(0);
                              switch (status.get("action")){
                                    case status.StatusSubmitted:
                                    waitingOnRespAgrmnts.add(model);
                                    break;
                                    case status.StatusCreated:
                                    draftAgrmnts.add(model);
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
                  }

            });

return Collection;

});