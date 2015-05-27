#Csv formatter

This things needs to be configured with:

* model (as model definition)
* a schema definition (currently supported : mongoose only)
* an exclude list (if you wish not to export all columns, array of fieldName)
* an object with custom field to extend data

`var formatter = csvResponse(model, 'mongoose', [], {})`

It then generates column definitions, based on the provided schema. Each column type has a default formatter.
It will be possible to provide user defined formatter to handle schemaless fields.

Then is possible to be called as:

`formatter(data)`

where data is an array of objects

### Default formatters implementation:

* String -> returned as it is
* Number -> returned as string
* Date -> returned as ISO 8601 Date
* Object -> it will flatten the object properties into columns

#### example

    prop : {
        a : 'b',
        c : { d : ''}
    }

will generate two columns 'prop.a' and 'prop.c.d' with values 'b' and '', respectively


It will then generate data, providing an array of arrays ready for csv serialization

##Usage example

```
var csvResponse = require('../middlewares/csv/index.js');
var modelCsvResponse = csvResponse(Model, 'mongoose', ['fieldToExclude']);
Model.find(
    function(err, result){

        if(err){ return next(err);}

        res.format({

            json : function(){

                res.json(result);
            },

            'text/csv' : function(){
                res.csv(modelCsvResponse(result));
            },
        });
    });
```

### Extend the model with custom field

Is possible to provide custom field to the formatter in this way:
```
var csvResponse = require('../middlewares/csv/index.js');
var extend = {
    customPropery : {
        Subproperty: Type (Number, String, ...)
    }
};

var modelCsvResponse = csvResponse(Model, 'mongoose', [], extend);
```

### More documentation and examples in spec/


## What's next

* Support loopback-style models
* Streams support
* .. add your own
