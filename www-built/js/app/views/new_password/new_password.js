define(["backbone","handlebars","parsley"],function(e,t,n){var r=e.View.extend({el:"#reset-pw-wrapper",events:{"blur input":"updateModel","click input[type=submit]":"submitModel"},initialize:function(e){console.log("init"),this.userID=e.userID,this.user={id:this.userID}},updateModel:function(e){this.user[e.target.name]=e.target.value},submitModel:function(e){e.preventDefault(),e.stopPropagation(),$.ajax({type:"PUT",url:"/user/"+this.userID+"/password",contentType:"application/json",dataType:"json",data:JSON.stringify(this.user),success:function(e){e.redirectURL&&(window.location=e.redirectURL)}})}});return r});