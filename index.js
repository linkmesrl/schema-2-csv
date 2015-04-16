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

function exportRow(row, colDefs){


}


module.exports = function(model, schemaType, exclude){

    var exporter = schemaTypes[schemaType];

    if(exporter === undefined){

        throw new Error('Unrecognized schema type '+schemaType);
    }

    var cols = exporter.columns(model, exclude);

    return function(data){

        var colnames =  lodash.pluck(cols, 'name');

        return data.reduce(function(rows, obj){

            var row = colnames.map(function(colname, i){

                console.log(colname, obj);

                return cols[i].formatter(obj[colname]);
            });

            rows.push(row);

            return rows;

        }, [colnames]);
    };
};
