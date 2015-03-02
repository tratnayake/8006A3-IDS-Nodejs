extended-emitter.js
==============
Everything you expect from `require('events').EventEmitter` plus:

optional criteria
-----------------
you can now specify that you only want the event if certain values are set:

    emitter.on('my_object_event', {
        myObjectId : object.id
    }, function(){
        //do stuff here
    });
    
or
    
    emitter.once('my_object_event', {
        myObjectId : object.id
    }, function(){
        //do stuff here
    });
    
when
----
    
and there's also the addition of a `when` function which can take ready-style arguments

    emitter.when([$(document).ready, 'my-init-event', 'my-load-event'], function(){
    
    });
    


Testing
-------

Run the tests at the project root with:

    mocha

Enjoy,

-Abbey Hawk Sparrow