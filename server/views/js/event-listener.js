var EventListener = function(){
    var events = {};

    function on(name, handler) {
        if (events.hasOwnProperty(name))
            events[name].push(handler);
        else
            events[name] = [handler];
    }
    
    function addEventListener(name, handler) {
        this.on(name, handler);
    }

    function removeEventListener(name, handler) {
        /* This is a bit tricky, because how would you identify functions?
           This simple solution should work if you pass THE SAME handler. */
        if (!events.hasOwnProperty(name))
            return;

        var index = events[name].indexOf(handler);
        if (index != -1)
            events[name].splice(index, 1);
    }

    function fireEvent(name, args) {
        if (!events.hasOwnProperty(name))
            return;

        if (!args || !args.length)
            args = [];

        var evs = events[name], l = evs.length;
        for (var i = 0; i < l; i++) {
            evs[i].apply(null, args);
        }
    }
};