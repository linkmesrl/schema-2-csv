'use strict';


/*
*  Ritorna tutte le chiavi dell' oggetto mongoose,
*  a patto che non siano array, più un formattatore di default
*
*/


exports.columns = function(model, _exclude){

    var exclude = _exclude || [];

    var data = Object.keys(model.schema.tree)

        .reduce(
            function(columns, fieldName){

                if(exclude.indexOf(fieldName) > -1){

                    return columns;
                }

                var a = model.schema.tree[fieldName];

                var colObj = null;

                switch (a.type){

                    case String:

                        colObj = {
                            formatter : function(val){ return val; },
                            type : 'String'
                        };
                    break;

                    case Number:

                        colObj = {
                            formatter : function(val){ return val.toString(); },
                            type : 'Number'
                        };
                    break;

                    case Date:

                        colObj = {
                            formatter : function(val){ return val.toString(); },
                            type : 'Number'
                        };
                    break;
                }


                if(colObj){
                    colObj.name = fieldName;
                    columns.push(colObj);
                }
                return columns;
            },
        []);

    return data;
};

exports.row = function(obj){

};
