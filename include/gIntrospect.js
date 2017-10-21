/*
introspection

g._.graph

each key is a hash name or label

each object:
labels and sets
keys are labels, values are hashes to other objects
labels have _.key === 1
nodes
if label was defined, it is set as #
its hash itself is at _.# (I read it as id/hash of my father)
*/

function gIntrospect(g) {

    function getFirstNonUnderscore(o) {
        for (var k in o) {
            if (k !== '_') { return k; }
        }
    }

    function _classify(o) {
        if (typeof o === 'string') {
            o = g._.graph[o];
        }

        var isKey = !!o._.key;
        if (isKey) {
            return {
                isKey: true,
                val: getFirstNonUnderscore(o)
            };
        }
        else {
            var primitives = {};
            var references = {};
            var v, k;
            for (k in o) {
                if (k === '_' || k === '#') { continue; }
                v = o[k];
                if (typeof v === 'object') {
                    references[k] = v['#'];
                }
                else {
                    primitives[k] = v;
                }
            }

            if (Object.keys(primitives).length === 0) {
                return {
                    isSet: true,
                    val: Object.keys(references)
                };
            }
            return {
                isObj: true,
                key: o['#'],
                val: {
                    primitives: primitives,
                    references: references
                }
            };
        }
    }

    function classify(k, oo) {
        var o = _classify(oo);
        if (o.isKey) {
            console.log('key', k, '->', o.val);
        }
        else if (o.isSet) {
            console.log('set', k, '->', o.val);
        }
        else {
            console.log('obj', k, '->', o.val);
        }
    }

    function logAll() {
        console.log('----');
        var gr = g._.graph;
        for (var k in gr) {
            classify(k, gr[k]);
        }
    }

    function visitAll(cb) {
        var k, o, gr = g._.graph;
        for (k in gr) {
            o = _classify(gr[k]);
            o.id = k;
            cb(o);
        }
    }

    return {
        classify: _classify,
        logAll:   logAll,
        visitAll: visitAll
    };

}
