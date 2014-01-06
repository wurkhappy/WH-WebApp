    Handlebars.registerHelper('phoneFormat', function(number) {
      if (!number) return;
      var areaCode = number.substring(0,3);
      var firstChunk = number.substring(3,6);
      var secondChunk = number.substring(6,10);
      return "("+areaCode +") "+firstChunk+"-"+secondChunk;
    });