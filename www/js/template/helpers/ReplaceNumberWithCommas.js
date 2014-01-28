    Handlebars.registerHelper('ReplaceNumberWithCommas', function(number) {
      if (!number) return;
      //Seperates the components of the number
      var n= number.toString().split(".");
      //Comma-fies the first part
      n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      //Combines the two sections
      console.log(n.join("."));
      return n.join(".");
    });