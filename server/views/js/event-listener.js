module.exports = function(){
    var events = {};

    this.on = function(name, handler) {
        if (events.hasOwnProperty(name))
            events[name].push(handler);
        else
            events[name] = [handler];
    };
    
    this.addEventListener = function(name, handler) {
        this.on(name, handler);
    };

    this.removeEventListener = function(name, handler) {
        /* This is a bit tricky, because how would you identify functions?
           This simple solution should work if you pass THE SAME handler. */
        if (!events.hasOwnProperty(name))
            return;

        var index = events[name].indexOf(handler);
        if (index != -1)
            events[name].splice(index, 1);
    };

    this.fireEvent = function(name, args) {
        if (!events.hasOwnProperty(name))
            return;

        if (!args || !args.length)
            args = [];

        var evs = events[name], l = evs.length;
        for (var i = 0; i < l; i++) {
            evs[i].apply(null, args);
        }
    };
};