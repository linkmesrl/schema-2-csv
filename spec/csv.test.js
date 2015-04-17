'use strict';

/* global it */
/* global describe */

var expect = require('chai').expect;

//FIND A BETTER TEST DATA
var fakeSchema = {

        number : {type : Number},
        date : {type : Date},
        hash : {type : String},
};


var fakeData = [
    { number : 11, date : new Date('2001-12-21'), hash : 'Hash'}
];

var mongooseSchema = { schema : { tree : fakeSchema}};

describe('The mongoose schema plugin', function(){

    var mongooseExporter = require('../lib/mongoose_schema');
    var exclude = [ 'hash', 'salt' ];

    it('gets the column row, excluding unneccessary columns', function(){

        var res = mongooseExporter.columns(mongooseSchema, exclude);

        res.forEach(function(excluded){

            expect(exclude.indexOf(excluded.name)).to.equal(-1);
        });
    });


    it('gets column name and formatters for basic field types', function(){

        var res = mongooseExporter.columns(mongooseSchema, exclude);

        expect(res.length).to.equal(2);
        expect(res[0].name).to.equal('number');
        expect(res[1].name).to.equal('date');
    });


    it('does not complain if the type is defined in an object or not', function(){

        var fakeSchema2 = {

            number :  Number,
            date :  Date,
            hash :  String,
        };

        var mongooseSchema2 = { schema : { tree : fakeSchema2}};

        var res = mongooseExporter.columns(mongooseSchema2, exclude);

        res.forEach(function(excluded){

            expect(exclude.indexOf(excluded.name)).to.equal(-1);
        });
    });
});


describe('The row generator', function(){

    var csvResponse = require('../index.js');
    var userCsvResponse = csvResponse(mongooseSchema, 'mongoose');

    it('generates the first row', function(){

        var cols = userCsvResponse(fakeData)[0];

        console.log(userCsvResponse(fakeData));

        expect(cols).to.deep.equal(['number', 'date', 'hash']);
    });

    it('correctly applies formatters', function(){

        var row = userCsvResponse(fakeData)[1];
        expect(row).to.deep.equal(['11', '2001-12-21T00:00:00.000Z', 'Hash']);
    });

    it('handles null/undefined fields returning an empty string', function(){

        var fakeSchema = {

            'undefined' : {type : Number},
            'null' : {type : Date},
            'false' : {type : Boolean},
            'emptystring' : { type : String},
            'negative' : { type : Number}
        };

        var fakeData = [

            {'undefined' : undefined, 'null' : null, 'false' : false, emptystring: '', negative : -1}
        ];

        var mongooseSchema = { schema : { tree : fakeSchema}};

        var userCsvResponse = csvResponse(mongooseSchema, 'mongoose');

            var row = userCsvResponse(fakeData)[1];
            expect(row).to.deep.equal(['', '', 'false','', '-1']);
    });


    /* by simple array I mean NO nested schemas */
    /* simple arrays containing complex objects should be suppressed via exclude, or a formatter
     * should be provided
     * */

    it('handles simple arrays', function(){

        var fakeSchema = {

            'array' : Array,
        };

        var fakeData = [

            {'array' : ['pizza', 'mafia', 'mandolino', 'disagio'] }
        ];

        var mongooseSchema = { schema : { tree : fakeSchema}};

        var userCsvResponse = csvResponse(mongooseSchema, 'mongoose');

            var row = userCsvResponse(fakeData)[1];
            expect(row).to.deep.equal(['pizza,mafia,mandolino,disagio']);
    });


    function ObjectId(str){

        this.str = str;
        this.toHexString = function(){ return this.str; };
    }

    it('handles ObjectIDs', function(){

        var fakeSchema = {

            '_id' : ObjectId,
        };

        var fakeData = [

            {'_id' : new ObjectId('552547c574ab294654d06c9a') }
        ];

        var mongooseSchema = { schema : { tree : fakeSchema}};

        var userCsvResponse = csvResponse(mongooseSchema, 'mongoose');

        var row = userCsvResponse(fakeData)[1];
        expect(row).to.deep.equal(['552547c574ab294654d06c9a']);
    });


    it('flattens objects', function(){

        var fakeSchema = {

            'prop' : {

                'subprop' :  String,
                'what' : { 'hey' : Number }
            }
        };

        var fakeData = [

            {'prop' : {

                'subprop' : 'gorgonzola',
                'what' : { 'hey' : 666 }
                }
            }
        ];

        var mongooseSchema = { schema : { tree : fakeSchema}};

        var userCsvResponse = csvResponse(mongooseSchema, 'mongoose');

            var result = userCsvResponse(fakeData);
            expect(result).to.deep.equal([ [ 'prop.subprop', 'prop.what.hey' ], [ 'gorgonzola', '666' ] ]);
        });
});
