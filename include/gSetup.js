/*global Gun:false, console:false*/
// https://github.com/amark/gun/wiki/API-(v0.3.x)

function gSetup(withRemotePeer, killLocalStorage) {
    'use strict';

    window.p = function(v) { console.log(v); }; // prints to console

    if (killLocalStorage) {
        localStorage.clear(); // kinda evil, just to discard eventual presence of old demo data
    }

    if (withRemotePeer) {
        window.g = Gun(location.origin + '/gun'); // sync with server peer
    }
    else {
        window.g = Gun(); // volatile demo
    }
}
