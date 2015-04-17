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

function nullFormatter(){

    return '';
}

function getPath(obj, path){

    if(!obj){ return ''; }

    for (var i=0; i<path.length; i++){

        obj = obj[path[i]];
        if(!obj){ return ''; }
    }

    return obj;
}

module.exports = function(model, schemaType, exclude){

    var exporter = schemaTypes[schemaType];

    if(exporter === undefined){

        throw new Error('Unrecognized schema type '+schemaType);
    }

    var cols = exporter.columns(model, exclude);

    return function(data){

        //for each row
        return data.reduce(function(rows, obj){

            //for each columns
            var row = cols.map(function(col, i){

                //se è ricorsivo scendi

                var toFormat= !!col.path ? getPath(obj, col.path) : obj[col.name];
                //var toFormat = obj[col.name];

                if(toFormat === null || toFormat === undefined){

                    //the value is passed, maybe in the future null and undefined will be treated differently
                    return nullFormatter(toFormat);
                }

                return cols[i].formatter(toFormat);
            });

            rows.push(row);

            return rows;

        }, [lodash.pluck(cols,'name')]);
    };
};
