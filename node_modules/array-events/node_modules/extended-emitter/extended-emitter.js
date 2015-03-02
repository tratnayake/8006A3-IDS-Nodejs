(function(root, factory){
    if (typeof define === 'function' && define.amd){
        define(['wolfy87-eventemitter'], factory);
    }else if(typeof exports === 'object'){
        module.exports = factory(require('events').EventEmitter);
    }else{
        root.ExtendedEmitter = factory(root.EventEmitter);
    }
}(this, function(EventEmitter){

    function processArgs(args){
        var result = {};
        if(typeof args[args.length-1] == 'function'){
            result.callback = args[args.length-1];
        }
        args = Array.prototype.slice.call(args);
        result.name = args.shift();
        result.conditions = args[0] || {};
        return result;
    }

    function meetsCriteria(name, object, testName, testObject){
        if(name != testName) return false;
        var result = true;
        Object.keys(testObject).forEach(function(key){
            result = result && object[key] === testObject[key];
        });
        return result;
    }

    function ExtendedEmitter(){
        this.emitter = new EventEmitter();
    }

    ExtendedEmitter.prototype.off = function(event, fn){
        return this.emitter.removeListener.apply(this.emitter, arguments)
    };
    
    ExtendedEmitter.prototype.allOff = function(event, fn){
        return this.emitter.removeAllListeners.apply(this.emitter, arguments)
    };

    ExtendedEmitter.prototype.on = function(name){
        var args = processArgs(arguments);
        var proxyFn = function(data){
            if(meetsCriteria(name, data, args.name, args.conditions)){
                args.callback.apply(args.callback, arguments);
            }
        };
        this.emitter.on.apply(this.emitter, [args.name, proxyFn]);
        return proxyFn;
    }

    ExtendedEmitter.prototype.emit = function(){
        return this.emitter.emit.apply(this.emitter, arguments);
    }

    ExtendedEmitter.prototype.once = function(name){
        var args = processArgs(arguments);
        var ob = this;
        var proxyFn = function cb(data){
            if(meetsCriteria(name, data, args.name, args.conditions)){
                args.callback.apply(args.callback, arguments);
                ob.off.apply(ob, [args.name, cb]);
            }
        };
        this.emitter.on.apply(this.emitter, [args.name, proxyFn]);
        return proxyFn;
    }

    ExtendedEmitter.prototype.when = function(events, callback){
        var count = 0;
        var returns = [];
        var ob = this;
        events.forEach(function(event, index){
            var respond = function(emission){
                count++;
                returns[index] = emission;
                if(count == events.length) callback.apply(callback, returns);
            }
            if(typeof event == 'function') event(respond);
            else return ob.emitter.once(event, respond);
        });
    };

    return ExtendedEmitter;
}));
