async-arrays.js
===============

prototype extensions for Array when using that data asynchronously, with utilities from prime-ext

Usage
-----
I find, most of the time, my asynchronous logic emerges from an array and I really just want to be able to control the completion of some job, and have a signal for all jobs. In many instances, this winds up being more versatile than a promise which limits you to a binary state and only groups returns according to it's state. 

you can either retain an instance and use it that way:

    var arrayTool = require('async-arrays');
    arrayTool.forEachEmission(array, iterator, calback);
    
or you can just attach to the prototype:

    require('async-arrays').proto();

forEachEmission : execute serially

    [].forEachEmission(function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAllEmissions : execute all jobs in parallel

    [].forAllEmissions(function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAllEmissionsInPool : execute all jobs in parallel up to a maximum #, then queue for later

    [].forAllEmissionsInPool(poolSize, function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
Utility functions(not mutators):

    ['dog', 'cat', 'mouse'].contains('cat') //returns true;

    ['dog', 'cat'].combine(['mouse']) //returns ['dog', 'cat', 'mouse'];
    
    ['dog', 'cat', 'mouse'].erase('cat') //returns ['dog', 'mouse'];
    

That's just about it, and even better you can open up the source and check it out yourself. Super simple.

Testing
-------
just run
    
    mocha

Enjoy,

-Abbey Hawk Sparrow