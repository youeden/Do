(function Do() {
    if(window.Do) return;
    windon.Do = Do;

    function Do(selector, context) {
        return Do.find(selector, context);
    }
})(window)
