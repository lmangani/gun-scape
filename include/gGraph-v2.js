function gGraph(g, gi, parentEl) {
    'use strict';

    if (!parentEl) {
        parentEl = document.body;
    }
    else if (typeof parentEl === 'string') {
        parentEl = document.querySelector(parentEl);
    }

    var blackC = '#000'; var whiteC = '#FFF';
    var objC = '#FAA'; var objC2 = '#DBB';
    var keyC = '#AAF'; var keyC2 = '#BBD';
    var setC = '#AFA'; var setC2 = '#BDB';
    var primC = '#DDD';

    var style = [ // http://js.cytoscape.org/#style/property-types
        {
            selector: '*',
            style: {
                content: 'data(label)',
                'font-size': 6
            }
        },
        {
            selector: 'node',
            style: {
                'text-valign': 'center',
                'text-halign': 'center',
                width:  10,
                height: 10
            }
        },
        {
            selector: 'edge',
            style: {
                'text-valign': 'center',
                'text-halign': 'center',
                width: 1,
                'target-arrow-shape': 'triangle',
                //'curve-style': 'unbundled-bezier'
            }
        },
        {
            selector: '.primn',
            style: {
                'font-family': 'monospace',
                'border-color': primC,
                'border-width': 0.5,
                'background-color': whiteC,
                shape: 'roundrectangle',
                width: 'label',
                height: 7,
                'padding-left':  1,
                'padding-right': 1
            }
        },
        {
            selector: '.objn',
            style: {
                'background-color': objC2,
                //'text-opacity': 0.5,
                'text-wrap': 'wrap'
            }
        },
        {
            selector: '.multiline',
            style: {
                'text-wrap': 'wrap',
                //'text-halign': 'left',
                shape: 'rectangle',
                width:  'label',
                height: 'label',
                'padding-left':  2,
                'padding-right': 2
            }
        },
        {
            selector: '.obje',
            style: {
                'font-weight': 'bold',
                'line-color':         objC,
                'target-arrow-color': objC
            }
        },
        {
            selector: '.keyn',
            style: {
                'font-family': 'Arial Narrow',
                shape: 'roundrectangle',
                'background-color': keyC2,
                'font-size': 7,
                'font-weight': 400,
                width: 'label',
                'padding-left':  1.5,
                'padding-right': 1.5,
                'padding-top': 0.5,
                'padding-bottom': 0.5,
                height: 8
            }
        },
        {
            selector: '.keye',
            style: {
                'line-color':         keyC,
                'target-arrow-color': keyC
            }
        },
        {
            selector: '.setn',
            style: {
                'background-color': setC2,
                shape: 'hexagon',
                width:  23,
                height: 20
            }
        },
        {
            selector: '.sete',
            style: {
                'line-color':         setC,
                'target-arrow-color': setC
            }
        },
        {
            selector: '.dashed',
            style: {
                'line-style': 'dashed'
            }
        }
    ];

    function genId() {
        return ( ~~(Math.random() * Math.pow(32, 6)) ).toString(32);
    }

    function forObj(o, cb) {
        for (var k in o) {
            if (!o.hasOwnProperty(k)) { continue; }
            cb(o[k], k);
        }
    }

    function render() {

        var nodes = [
            //{data: {id:'n1', label:'N1'}, classes:'outline'},
            //{data: {id:'n2', label:'N2'}, classes:'background'}
        ];

        var edges = [
            //{data: {id:'e1', source:'n1', target:'n2', label:'E1'}}
        ];

        function isUnknown(ref) {
            return (!(ref in g._.graph));
        }

        gi.visitAll(function(o) {
            var cls = ( o.isObj ? 'obj' : (o.isSet ? 'set' : 'key') );

            var nodeText = [];

            if (o.isKey) {
                if (isUnknown(o.val)) { return console.log('key: skipped unknown %s', o.val); }
                edges.push({data:{source:o.id, target:o.val}, classes:'keye dashed'});
            }
            else if (o.isSet) {
                o.val.forEach(function(ref) {
                    if (isUnknown(ref)) { return console.log('set: skipped unknown %s', ref); }
                    edges.push({data:{source:o.id, target:ref}, classes:'sete dashed'});
                });
            }
            else {
                forObj(o.val.primitives, function(primV, attrName) {
                    /*var id = genId();
                    edges.push({data:{source:o.id, target:id, label:attrName}, classes:'obje'});
                    nodes.push({data:{id:id, label:JSON.stringify(primV)}, classes:'primn'});*/

                    nodeText.push( [ attrName, ': ', JSON.stringify(primV) ].join('') );
                });
                forObj(o.val.references, function(ref, attrName) {
                    if (isUnknown(ref)) { return console.log('obj: skipped unknown %s', ref); }
                    edges.push({data:{source:o.id, target:ref, label:attrName}, classes:'obje dashed'});
                });
            }

            var d = {id:o.id};
            if (cls === 'key') {
                d.label = o.id;
            }
            else if (cls === 'obj' && nodeText.length > 0) {
                d.label = nodeText.join('\n');
                cls = 'multiline obj';
            }
            nodes.push({data:d, classes:cls+'n'});
        });

        if (parentEl.firstChild) {
            parentEl.removeChild(parentEl.firstChild);
        }

        cytoscape({
            container: parentEl,
            elements: {
                nodes: nodes,
                edges: edges
            },
            layout: {
                name: 'cose-bilkent', // https://github.com/cytoscape/cytoscape.js-cose-bilkent#api
                randomize: false,
                fit: true
            },
            style: style
        });

    }

    render();

    return render;

}
