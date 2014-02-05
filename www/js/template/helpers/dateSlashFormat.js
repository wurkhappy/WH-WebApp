    Handlebars.registerHelper('dateSlashFormat', function(date) {
        if (!date) {
            return;
        }
        return date.format('MM/DD/YYYY');
    });