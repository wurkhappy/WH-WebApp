    Handlebars.registerHelper('PlusOne', function(index) {
        if (!index) {
            return
        };
        return parseInt(index) + 1;
    });