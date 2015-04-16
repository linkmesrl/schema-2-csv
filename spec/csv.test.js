'use strict';

var expect = require('chai').expect;

//FIND A BETTER TEST SCHEMA
var fakeSchema = {

        number : {type : Number},
        date : {type : Date},
        hash : {type : String},
};

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
});


describe('The row generator', function(){

    var userCsvResponse = csvResponse(fakeSchema, 'mongoose');
    var data = require('./darealdata.js');

    var exporter = require('../index.js');

    it('generates the first row', function(){


    });
});
