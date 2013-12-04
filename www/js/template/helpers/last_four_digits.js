    Handlebars.registerHelper('last_four_digits', function(number) {
      if (!number) return;
      return number.slice(-4);
    });