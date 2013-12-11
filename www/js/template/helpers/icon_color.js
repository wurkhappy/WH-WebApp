    Handlebars.registerHelper('icon_color', function(position, value) {
      if (position <= value/34 || position == 0) return 'green_icon';
      return '';
    });