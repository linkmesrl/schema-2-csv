#Csv export middleware

This thing generates an express middleware which sits at the end of a middleware chain and:

* examines the request to see if csv was requestes
* transforms the response to csv, using the provided schema to generate columns

example:

    var csvExportable = require(''),

    app.get('/api/user',
            userMW.isLoggedIn,
            userMW.checkAccess('view', 'Project.user_list'),
            user.index,
            csvExportable(mongoose.model('User'))
   );

## Supported schema models:

    * Mongoose
    * Loopback (Coming soon)
