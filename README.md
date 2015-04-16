#Csv formatter

This things takes:

* data (as an array of objects)
* a schema definition (currently supported : mongoose only)
* an exclude list (if you wish not to export all columns)

It then generates column definitions, based on the provided schema. Each column type has a default formatter.
It will be possible to provide user defined formatter to handle schemaless fields.

Default formatters implementation:

* String -> returned as it is
* Number -> returned as string
* Date -> returned as ISO 8601 Date

It will then generate data, providing an array of arrays ready for csv serialization


### Usage examples in spec/

## What's next

* Support loopback-style models
* Streams support
* .. add your own
