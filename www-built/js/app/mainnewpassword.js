/*! wurk-happy v0.0.1 | 14-11-2013-06:46:53
 * Copyright (c) 2013 |!function(e){var t=function(e){this.messages={defaultMessage:"This value seems to be invalid.",type:{email:"This value should be a valid email.",url:"This value should be a valid url.",urlstrict:"This value should be a valid url.",number:"This value should be a valid number.",digits:"This value should be digits.",dateIso:"This value should be a valid date (YYYY-MM-DD).",alphanum:"This value should be alphanumeric.",phone:"This value should be a valid phone number."},notnull:"This value should not be null.",notblank:"This value should not be blank.",required:"This value is required.",regexp:"This value seems to be invalid.",min:"This value should be greater than or equal to %s.",max:"This value should be lower than or equal to %s.",range:"This value should be between %s and %s.",minlength:"This value is too short. It should have %s characters or more.",maxlength:"This value is too long. It should have %s characters or less.",rangelength:"This value length is invalid. It should be between %s and %s characters long.",mincheck:"You must select at least %s choices.",maxcheck:"You must select %s choices or less.",rangecheck:"You must select between %s and %s choices.",equalto:"This value should be the same."},this.init(e)};t.prototype={constructor:t,validators:{notnull:function(e){return e.length>0},notblank:function(e){return"string"==typeof e&&""!==e.replace(/^\s+/g,"").replace(/\s+$/g,"")},required:function(e){if("object"==typeof e){for(var t in e)if(this.required(e[t]))return!0;return!1}return this.notnull(e)&&this.notblank(e)},type:function(e,t){var n;switch(t){case"number":n=/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;break;case"digits":n=/^\d+$/;break;case"alphanum":n=/^\w+$/;break;case"email":n=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;break;case"url":e=(new RegExp("(https?|s?ftp|git)","i")).test(e)?e:"http://"+e;case"urlstrict":n=/^(https?|s?ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;break;case"dateIso":n=/^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/;break;case"phone":n=/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;break;default:return!1}return""!==e?n.test(e):!1},regexp:function(e,t,n){return(new RegExp(t,n.options.regexpFlag||"")).test(e)},minlength:function(e,t){return e.length>=t},maxlength:function(e,t){return e.length<=t},rangelength:function(e,t){return this.minlength(e,t[0])&&this.maxlength(e,t[1])},min:function(e,t){return Number(e)>=t},max:function(e,t){return Number(e)<=t},range:function(e,t){return e>=t[0]&&e<=t[1]},equalto:function(t,n,r){return r.options.validateIfUnchanged=!0,t===e(n).val()},remote:function(t,n,r){var i=null,s={},o={};s[r.$element.attr("name")]=t,"undefined"!=typeof r.options.remoteDatatype&&(o={dataType:r.options.remoteDatatype});var u=function(t,n){"undefined"!=typeof n&&"undefined"!=typeof r.Validator.messages.remote&&n!==r.Validator.messages.remote&&e(r.ulError+" .remote").remove(),r.updtConstraint({name:"remote",valid:t},n),r.manageValidationResult()},a=function(t){if("object"==typeof t)return t;try{t=e.parseJSON(t)}catch(n){}return t},f=function(e){return"object"==typeof e&&null!==e?"undefined"!=typeof e.error?e.error:"undefined"!=typeof e.message?e.message:null:null};return e.ajax(e.extend({},{url:n,data:s,type:r.options.remoteMethod||"GET",success:function(e){e=a(e),u(1===e||!0===e||"object"==typeof e&&null!==e&&"undefined"!=typeof e.success,f(e))},error:function(e){e=a(e),u(!1,f(e))}},o)),i},mincheck:function(e,t){return this.minlength(e,t)},maxcheck:function(e,t){return this.maxlength(e,t)},rangecheck:function(e,t){return this.rangelength(e,t)}},init:function(e){var t=e.validators,n=e.messages,r;for(r in t)this.addValidator(r,t[r]);for(r in n)this.addMessage(r,n[r])},formatMesssage:function(e,t){if("object"==typeof t){for(var n in t)e=this.formatMesssage(e,t[n]);return e}return"string"==typeof e?e.replace(new RegExp("%s","i"),t):""},addValidator:function(e,t){this.validators[e]=t},addMessage:function(e,t,n){if("undefined"!=typeof n&&!0===n){this.messages.type[e]=t;return}if("type"===e){for(var r in t)this.messages.type[r]=t[r];return}this.messages[e]=t}};var n=function(e,n,r){this.options=n,this.Validator=new t(n);if(r==="ParsleyFieldMultiple")return this;this.init(e,r||"ParsleyField")};n.prototype={constructor:n,init:function(t,n){this.type=n,this.valid=!0,this.element=t,this.validatedOnce=!1,this.$element=e(t),this.val=this.$element.val(),this.isRequired=!1,this.constraints={},"undefined"==typeof this.isRadioOrCheckbox&&(this.isRadioOrCheckbox=!1,this.hash=this.generateHash(),this.errorClassHandler=this.options.errors.classHandler(t,this.isRadioOrCheckbox)||this.$element),this.ulErrorManagement(),this.bindHtml5Constraints(),this.addConstraints(),this.hasConstraints()&&this.bindValidationEvents()},setParent:function(t){this.$parent=e(t)},getParent:function(){return this.$parent},bindHtml5Constraints:function(){if(this.$element.hasClass("required")||this.$element.prop("required"))this.options.required=!0;"undefined"!=typeof this.$element.attr("type")&&(new RegExp(this.$element.attr("type"),"i")).test("email url number range")&&(this.options.type=this.$element.attr("type"),(new RegExp(this.options.type,"i")).test("number range")&&(this.options.type="number","undefined"!=typeof this.$element.attr("min")&&this.$element.attr("min").length&&(this.options.min=this.$element.attr("min")),"undefined"!=typeof this.$element.attr("max")&&this.$element.attr("max").length&&(this.options.max=this.$element.attr("max")))),"string"==typeof this.$element.attr("pattern")&&this.$element.attr("pattern").length&&(this.options.regexp=this.$element.attr("pattern"))},addConstraints:function(){for(var e in this.options){var t={};t[e]=this.options[e],this.addConstraint(t,!0)}},addConstraint:function(e,t){for(var n in e)n=n.toLowerCase(),"function"==typeof this.Validator.validators[n]&&(this.constraints[n]={name:n,requirements:e[n],valid:null},n==="required"&&(this.isRequired=!0),this.addCustomConstraintMessage(n));"undefined"==typeof t&&this.bindValidationEvents()},updateConstraint:function(e,t){for(var n in e)this.updtConstraint({name:n,requirements:e[n],valid:null},t)},updtConstraint:function(t,n){this.constraints[t.name]=e.extend(!0,this.constraints[t.name],t),"string"==typeof n&&(this.Validator.messages[t.name]=n),this.bindValidationEvents()},removeConstraint:function(e){var e=e.toLowerCase();delete this.constraints[e],e==="required"&&(this.isRequired=!1);if(!this.hasConstraints()){if("ParsleyForm"==typeof this.getParent()){this.getParent().removeItem(this.$element);return}this.destroy();return}this.bindValidationEvents()},addCustomConstraintMessage:function(e){var t=e+("type"===e&&"undefined"!=typeof this.options[e]?this.options[e].charAt(0).toUpperCase()+this.options[e].substr(1):"")+"Message";"undefined"!=typeof this.options[t]&&this.Validator.addMessage("type"===e?this.options[e]:e,this.options[t],"type"===e)},bindValidationEvents:function(){this.valid=null,this.$element.addClass("parsley-validated"),this.$element.off("."+this.type),this.options.remote&&!(new RegExp("change","i")).test(this.options.trigger)&&(this.options.trigger=this.options.trigger?" change":"change");var t=(this.options.trigger?this.options.trigger:"")+((new RegExp("key","i")).test(this.options.trigger)?"":" keyup");this.$element.is("select")&&(t+=(new RegExp("change","i")).test(t)?"":" change"),t=t.replace(/^\s+/g,"").replace(/\s+$/g,""),this.$element.on((t+" ").split(" ").join("."+this.type+" "),!1,e.proxy(this.eventValidation,this))},generateHash:function(){return"parsley-"+(Math.random()+"").substring(2)},getHash:function(){return this.hash},getVal:function(){return this.$element.data("value")||this.$element.val()},eventValidation:function(e){var t=this.getVal();if(e.type==="keyup"&&!/keyup/i.test(this.options.trigger)&&!this.validatedOnce)return!0;if(e.type==="change"&&!/change/i.test(this.options.trigger)&&!this.validatedOnce)return!0;if(!this.isRadioOrCheckbox&&this.getLength(t)<this.options.validationMinlength&&!this.validatedOnce)return!0;this.validate()},getLength:function(e){return!e||!e.hasOwnProperty("length")?0:e.length},isValid:function(){return this.validate(!1)},hasConstraints:function(){for(var e in this.constraints)return!0;return!1},validate:function(e){var t=this.getVal(),n=null;return this.hasConstraints()?this.options.listeners.onFieldValidate(this.element,this)||""===t&&!this.isRequired?(this.reset(),null):this.needsValidation(t)?(n=this.applyValidators(),("undefined"!=typeof e?e:this.options.showErrors)&&this.manageValidationResult(),n):this.valid:null},needsValidation:function(e){return!this.options.validateIfUnchanged&&this.valid!==null&&this.val===e&&this.validatedOnce?!1:(this.val=e,this.validatedOnce=!0)},applyValidators:function(){var e=null;for(var t in this.constraints){var n=this.Validator.validators[this.constraints[t].name](this.val,this.constraints[t].requirements,this);!1===n?(e=!1,this.constraints[t].valid=e,this.options.listeners.onFieldError(this.element,this.constraints,this)):!0===n&&(this.constraints[t].valid=!0,e=!1!==e,!1===this.options.listeners.onFieldSuccess(this.element,this.constraints,this)&&(e=!1))}return e},manageValidationResult:function(){var t=null;for(var n in this.constraints)!1===this.constraints[n].valid?(this.manageError(this.constraints[n]),t=!1):!0===this.constraints[n].valid&&(this.removeError(this.constraints[n].name),t=!1!==t);return this.valid=t,!0===this.valid?(this.removeErrors(),this.errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass),!0):!1===this.valid?(this.errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass),!1):(this.ulError&&e(this.ulError).children().length===0&&this.removeErrors(),t)},ulErrorManagement:function(){this.ulError="#"+this.hash,this.ulTemplate=e(this.options.errors.errorsWrapper).attr("id",this.hash).addClass("parsley-error-list")},removeError:function(t){var n=this.ulError+" ."+t,r=this;this.options.animate?e(n).fadeOut(this.options.animateDuration,function(){e(this).remove(),r.ulError&&e(r.ulError).children().length===0&&r.removeErrors()}):e(n).remove()},addError:function(t){for(var n in t){var r=e(this.options.errors.errorElem).addClass(n);e(this.ulError).append(this.options.animate?e(r).html(t[n]).hide().fadeIn(this.options.animateDuration):e(r).html(t[n]))}},removeErrors:function(){this.options.animate?e(this.ulError).fadeOut(this.options.animateDuration,function(){e(this).remove()}):e(this.ulError).remove()},reset:function(){this.valid=null,this.removeErrors(),this.validatedOnce=!1,this.errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass);for(var e in this.constraints)this.constraints[e].valid=null;return this},manageError:function(t){e(this.ulError).length||this.manageErrorContainer();if("required"===t.name&&null!==this.getVal()&&this.getVal().length>0)return;if(!(!this.isRequired||"required"===t.name||null!==this.getVal()&&0!==this.getVal().length))return;var n=t.name,r=!1!==this.options.errorMessage?"custom-error-message":n,i={},s=!1!==this.options.errorMessage?this.options.errorMessage:t.name==="type"?this.Validator.messages[n][t.requirements]:"undefined"==typeof this.Validator.messages[n]?this.Validator.messages.defaultMessage:this.Validator.formatMesssage(this.Validator.messages[n],t.requirements);e(this.ulError+" ."+r).length||(i[r]=s,this.addError(i))},manageErrorContainer:function(){var t=this.options.errorContainer||this.options.errors.container(this.element,this.isRadioOrCheckbox),n=this.options.animate?this.ulTemplate.show():this.ulTemplate;if("undefined"!=typeof t){e(t).append(n);return}this.isRadioOrCheckbox?this.$element.parent().after(n):this.$element.after(n)},addListener:function(e){for(var t in e)this.options.listeners[t]=e[t]},destroy:function(){this.$element.removeClass("parsley-validated"),this.reset().$element.off("."+this.type).removeData(this.type)}};var r=function(e,n,r){this.initMultiple(e,n),this.inherit(e,n),this.Validator=new t(n),this.init(e,r||"ParsleyFieldMultiple")};r.prototype={constructor:r,initMultiple:function(t,n){this.element=t,this.$element=e(t),this.group=n.group||!1,this.hash=this.getName(),this.siblings=this.group?'[data-group="'+this.group+'"]':'input[name="'+this.$element.attr("name")+'"]',this.isRadioOrCheckbox=!0,this.isRadio=this.$element.is("input[type=radio]"),this.isCheckbox=this.$element.is("input[type=checkbox]"),this.errorClassHandler=n.errors.classHandler(t,this.isRadioOrCheckbox)||this.$element.parent()},inherit:function(e,t){var r=new n(e,t,"ParsleyFieldMultiple");for(var i in r)"undefined"==typeof this[i]&&(this[i]=r[i])},getName:function(){if(this.group)return"parsley-"+this.group;if("undefined"==typeof this.$element.attr("name"))throw"A radio / checkbox input must have a data-group attribute or a name to be Parsley validated !";return"parsley-"+this.$element.attr("name").replace(/(:|\.|\[|\])/g,"")},getVal:function(){if(this.isRadio)return e(this.siblings+":checked").val()||"";if(this.isCheckbox){var t=[];return e(this.siblings+":checked").each(function(){t.push(e(this).val())}),t}},bindValidationEvents:function(){this.valid=null,this.$element.addClass("parsley-validated"),this.$element.off("."+this.type);var t=this,n=(this.options.trigger?this.options.trigger:"")+((new RegExp("change","i")).test(this.options.trigger)?"":" change");n=n.replace(/^\s+/g,"").replace(/\s+$/g,""),e(this.siblings).each(function(){e(this).on(n.split(" ").join("."+t.type+" "),!1,e.proxy(t.eventValidation,t))})}};var i=function(e,t,n){this.init(e,t,n||"parsleyForm")};i.prototype={constructor:i,init:function(t,n,r){this.type=r,this.items=[],this.$element=e(t),this.options=n;var i=this;this.$element.find(n.inputs).each(function(){i.addItem(this)}),this.$element.on("submit."+this.type,!1,e.proxy(this.validate,this))},addListener:function(e){for(var t in e)if((new RegExp("Field")).test(t))for(var n=0;n<this.items.length;n++)this.items[n].addListener(e);else this.options.listeners[t]=e[t]},addItem:function(t){if(e(t).is(this.options.excluded))return!1;var n=e(t).parsley(this.options);n.setParent(this),this.items.push(n)},removeItem:function(t){var n=e(t).parsley();for(var r=0;r<this.items.length;r++)if(this.items[r].hash===n.hash)return this.items[r].destroy(),this.items.splice(r,1),!0;return!1},validate:function(e){var t=!0;this.focusedField=!1;for(var n=0;n<this.items.length;n++)if("undefined"!=typeof this.items[n]&&!1===this.items[n].validate()){t=!1;if(!this.focusedField&&"first"===this.options.focus||"last"===this.options.focus)this.focusedField=this.items[n].$element}this.focusedField&&!t&&this.focusedField.focus();var r=this.options.listeners.onFormSubmit(t,e,this);return"undefined"!=typeof r?r:t},isValid:function(){for(var e=0;e<this.items.length;e++)if(!1===this.items[e].isValid())return!1;return!0},removeErrors:function(){for(var e=0;e<this.items.length;e++)this.items[e].parsley("reset")},destroy:function(){for(var e=0;e<this.items.length;e++)this.items[e].destroy();this.$element.off("."+this.type).removeData(this.type)},reset:function(){for(var e=0;e<this.items.length;e++)this.items[e].reset()}},e.fn.parsley=function(t,s){function a(u,a){var f=e(u).data(a);if(!f){switch(a){case"parsleyForm":f=new i(u,o,"parsleyForm");break;case"parsleyField":f=new n(u,o,"parsleyField");break;case"parsleyFieldMultiple":f=new r(u,o,"parsleyFieldMultiple");break;default:return}e(u).data(a,f)}if("string"==typeof t&&"function"==typeof f[t]){var l=f[t](s);return"undefined"!=typeof l?l:e(u)}return f}var o=e.extend(!0,{},e.fn.parsley.defaults,"undefined"!=typeof window.ParsleyConfig?window.ParsleyConfig:{},t,this.data()),u=null;return e(this).is("form")||!0===e(this).data("bind")?u=a(e(this),"parsleyForm"):e(this).is(o.inputs)&&!e(this).is(o.excluded)&&(u=a(e(this),e(this).is("input[type=radio], input[type=checkbox]")?"parsleyFieldMultiple":"parsleyField")),"function"==typeof s?s():u},e.fn.parsley.Constructor=i,e.fn.parsley.defaults={inputs:"input, textarea, select",excluded:"input[type=hidden], input[type=file], :disabled",trigger:!1,animate:!0,animateDuration:300,focus:"first",validationMinlength:3,successClass:"parsley-success",errorClass:"parsley-error",errorMessage:!1,validators:{},showErrors:!0,messages:{},validateIfUnchanged:!1,errors:{classHandler:function(e,t){},container:function(e,t){},errorsWrapper:"<ul></ul>",errorElem:"<li></li>"},listeners:{onFieldValidate:function(e,t){return!1},onFormSubmit:function(e,t,n){},onFieldError:function(e,t,n){},onFieldSuccess:function(e,t,n){}}},e(window).on("load",function(){e('[data-validate="parsley"]').each(function(){e(this).parsley()})})}(window.jQuery||window.Zepto),define("parsley",["jquery"],function(e){return function(){var t,n;return t||e.parsley}}(this)),define("views/new_password/new_password",["backbone","handlebars","parsley"],function(e,t,n){var r=e.View.extend({el:"#reset-pw-wrapper",events:{"blur input":"updateModel","click input[type=submit]":"submitModel"},initialize:function(e){console.log("init"),this.userID=e.userID,this.user={id:this.userID}},updateModel:function(e){this.user[e.target.name]=e.target.value},submitModel:function(e){e.preventDefault(),e.stopPropagation(),$.ajax({type:"PUT",url:"/user/"+this.userID+"/password",contentType:"application/json",dataType:"json",data:JSON.stringify(this.user),success:function(e){e.redirectURL&&(window.location=e.redirectURL)}})}});return r}),define("app/routers/new_password_router",["backbone","views/new_password/new_password"],function(e,t){var n=e.Router.extend({routes:{"":"index"},initialize:function(){},index:function(){this.view=new t({userID:window.user.id})}});return n}),define("app/mainnewpassword",["require","app/routers/new_password_router"],function(e){var t=e("app/routers/new_password_router");$(function(){var e=new t;Backbone.history.start({pushState:!1})})});