require('babel/polyfill');

var _ = require('underscore'),
    csp = require('js-csp');

function * player(name, table) {
    while (true) {
        var ball = yield csp.take(table);
        if (ball === csp.CLOSED) {
            console.log(name + ": table's gone");
            return;
        }
        ball.hits += 1;
        console.log(name + " " + ball.hits);
        yield csp.timeout(100);
        yield csp.put(table, ball);

    }
}

csp.go(function * () {
    var table = csp.chan();

    csp.go(player, ["ping", table]);
    csp.go(player, ["pong", table]);

    yield csp.put(table, {
        hits: 0
    });
    yield csp.timeout(1000);
    table.close();
});

var obj = {
    that: "whatever"
}
_.filter(obj, function(item, index) {
    console.log(item, index)
});

function assoc(baseMap, cursor, value) {

    var clen = cursor.length,
        i = 0,
        mapObj = JSON.parse(JSON.stringify(baseMap)),
        mappedCursor = mapObj,
        cval, ctype;

    for (; i < clen; i++) {
        ctype = cursor[i][0];
        cval = cursor[i].slice(1);

        switch (ctype) {
            case '{':
                {
                    if (!(mappedCursor[cval] && typeof mappedCursor[cval] === 'object')) {
                        mappedCursor[cval] = {};
                    }
                    mappedCursor = mappedCursor[cval]
                }
                break;
            case '[':
                {
                    if (!(mappedCursor[cval] && Array.isArray(mappedCursor[cval]))) {
                        mappedCursor[cval] = [];
                    }
                    mappedCursor = mappedCursor[cval]
                }
            default:
                break;
        }
    }

    if (Array.isArray(mappedCursor)) {
        mappedCursor.push(value);
    } else {
        mappedCursor[value[0]] = value[1];
    }

    return mapObj;
}

//window.assoc = assoc;

module.exports.assoc = assoc;