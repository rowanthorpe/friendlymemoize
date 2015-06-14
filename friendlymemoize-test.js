// © Copyright 2015 Rowan Thorpe
//
// This file is part of friendlymemoize
//
// friendlymemoize is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// friendlymemoize is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with friendlymemoize. If not, see <http://www.gnu.org/licenses/>.

'use strict';

var print_output = false;
var formulas = ['factorial', 'fibonacci'];

function run_it(formula, text, xmax, ymax, zmax) {
    var x, y, z, begin;
    console.log('**** running ' + formula + ' (' + xmax + ', ' + ymax + ', ' + zmax + '): ' + text);
    for (z = 0; z < zmax; z++) {
        begin = Date.now();
        for (y = 0; y < ymax; y++) {
            for (x = 0; x < xmax; x++) {
                if (print_output) {
                    console.log(window[formula](x));
                } else {
                    window[formula](x);
                };
            };
        };
        console.log('Time taken: ' + (Date.now() - begin));
    };
};

////

function factorial(n) { return n < 2 ? 1 : n * factorial(n - 1); };
function fibonacci(n) { return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2); };

////

var memo = {};

for (var q = 0; q < formulas.length; q++) {
    var a, b, c;
    if (formulas[q] == 'fibonacci') {
        memo[formulas[q]] = FriendlyMemoize(formulas[q], 26, 53);
        a = 40;
        b = 20;
        c = 1;
    } else {
        memo[formulas[q]] = FriendlyMemoize(formulas[q], 100, 200);
        a = 150;
        b = 1000;
        c = 10;
    };

    // ensure persistent values don't bias first-run timings
    memo[formulas[q]].clearDiskVals();

    console.log('**** memo[' + formulas[q] + '] properties');
    console.log('formula: ' + memo[formulas[q]].getFormula());
    console.log('mem_limit: ' + memo[formulas[q]].getMemLimit());
    console.log('disk_limit: ' + memo[formulas[q]].getDiskLimit());

    run_it(formulas[q], 'un-memoized', a, b, c);

    memo[formulas[q]].memoize();
    run_it(formulas[q], 'memoized', a, b, c);

    memo[formulas[q]].unmemoize();
    run_it(formulas[q], 'un-memoized again', a, b, c);

    memo[formulas[q]].memoize();
    run_it(formulas[q], 'memoized again (with values cached from before, will be fractionally faster)', a, b, c);

    memo[formulas[q]].setMemLimit(memo[formulas[q]].getDiskLimit());
    run_it(formulas[q], 'memoized again with new mem_limit == disk_limit (use pre-cached mem-values, don\'t use disk, must calculate extra mem-values first time)', a, b, c);

    memo[formulas[q]].clearMemVals();
    run_it(formulas[q], 'memoized again, clearing cached values first (must calculate all mem-values first time)', a, b, c);

    run_it(formulas[q], 'memoized again (all mem-values are cached)', a, b, c);

    memo[formulas[q]].clearDiskVals();
    memo[formulas[q]].setMemLimit(0);
    run_it(formulas[q], 'memoized again with mem_limit=0 (don\'t use mem, must calculate all disk-values first time)', a ,b ,c);

    run_it(formulas[q], 'memoized again (all disk-values are cached)', a, b, c);

};
