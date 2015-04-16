'use strict';

/*
 *  Middleware per generazione di csv.
 *  ---------------------------------
 *
 *  Intercetta una risposta json (quindi deve essere messo in fondo alla catena)
 *  se era stata richiesta come text/csv allora la trasforma in text/csv.
 *
 */

var lodash = require('lodash');

var schemaTypes = {

    mongoose: require('./lib/mongoose_schema')

};

module.exports = function(model, schemaType, exclude){

    var exporter = schemaTypes[schemaType];

    if(exporter === undefined){

        throw new Error('Unrecognized schema type '+schemaType);
    }

    var cols = exporter.columns(model);

    return function(data){

        var firstRow = lodash.pluck(cols, 'name');
    };
};
