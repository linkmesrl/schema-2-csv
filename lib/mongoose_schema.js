'use strict';

var _ = require('lodash');
/*
*  Ritorna tutte le chiavi dell' oggetto mongoose,
*  a patto che non siano array, più un formattatore di default
*
*/
exports.columns = function(model, _exclude, extend){

    var exclude = _exclude || [];

    var schema = _.extend(_.clone(model.schema.tree), extend);

    var columns = Object.keys(schema)

        .reduce(
            function(columns, fieldName){

                if(exclude.indexOf(fieldName) > -1){

                    return columns;
                }

                var schemaObj = schema[fieldName];
                addColumn(schemaObj, fieldName, columns);

                return columns;
            },
        []);

    return columns;
};


function addColumn(schemaObj, fieldName, columns, path){

    var type = getType(schemaObj.type || schemaObj);

    var colObj = null;
    switch (type){

        case String:

            colObj = {
                formatter : function(val){ return val; },
            };
        break;

        case Boolean:
        case Number:

        //NOT an array of embedded schemas
        case 'Array':
        case 'Mixed':

            colObj = {
                formatter : function(val){ return val.toString(); },
            };
        break;

        case 'ObjectId':

            colObj = {
                formatter : function(val){ return val.toHexString(); },
            };
        break;

        case Date:

            colObj = {
                formatter : function(val){ return val.toISOString(); },
            };
        break;

        case 'Object':

            // each object can create N columns
            // I am guarenteed here that it has properties
           return flattenObject(schemaObj, fieldName, columns);

        // ModelArray ReferenceArray and virtual are just parked here
        // Better to exclude them for good now
        case 'ModelArray':
        case 'ReferenceArray':
        case 'virtual':
        default:

            colObj = {
                formatter : function(val){
                    console.log('Val: ', val, val.toString());
                    return val.toString();
                },
                type : 'default'
            };
    }

    if(colObj){
        colObj.name = fieldName;
        colObj.type = type;

        //in case of nested fields, this tells the path to the value
        //we do not directlye use the name to allow fields to contain '.' in the name
        colObj.path = path || undefined;
        columns.push(colObj);
    }
}

// Recursively create endless columns
//

function flattenObject(schemaObj, fieldName, columns){

    Object.keys(schemaObj).forEach(function(key){

        var name = fieldName+'.'+key;

        addColumn(schemaObj[key], name, columns, name.split('.') );
    });
}


//
// This function maps a mongoose type obj to something understandable
// by the switch in the columns() functio
//
function getType(typeObj){

    if(typeObj === Boolean ||
        typeObj === Date ||
        typeObj === String ||
        typeObj === Number){

        return typeObj;
    }

    // Mixed, simple Array, ObjectId

    if(typeof typeObj.name === 'string'){
        return typeObj.name;
    }

    //test
    if(typeof typeObj.path === 'string' && Array.isArray(typeObj.getters)){

        return 'virtual';
    }

    //now, if Array.isArray returns true, then this badboy is an array containing other models
    //or references - test
    if(Array.isArray(typeObj)){

        if(typeObj[0].tree){

            return 'ModelArray';
        }
        if(typeObj[0].ref){

            return 'ReferenceArray';
        }
    }

    //then it might be
    if(Object.keys(typeObj).length > 0){

        return 'Object';
    }

    // could not get it - it will be handled by the default clause
    return 'Mixed';
}
