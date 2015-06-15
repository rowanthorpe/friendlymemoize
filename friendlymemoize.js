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

// TODO: Instead of only having an array for in-memory cache, indexed by
//       whole-number inputs, and coercing localStorage output to whole
//       numbers, use (de-)serialisation for arbitrary types (stringified
//       input for localStorage & in-memory-object keys, and stringified
//       output for localStorage values).

var FriendlyMemoize = function(formula, mem_limit, disk_limit) {
    var def_mem_limit = 100;
    var def_disk_limit = 200;
    var disk_keys_pref = 'memoized_' + formula + '_';
    var disk_keys_re = new RegExp('^' + disk_keys_pref);
    var replaced;
    var memoized = [];
    var obj = {
        getFormula: function() {
            return(formula);
        },
        getMemLimit: function() {
            return(mem_limit);
        },
        getDiskLimit: function() {
            return(disk_limit);
        },
        setMemLimit: function(new_limit) {
            mem_limit = new_limit || def_mem_limit;
        },
        setDiskLimit: function(new_limit) {
            if (!localStorage || mem_limit > new_limit) {
                disk_limit = mem_limit;
            } else {
                disk_limit = new_limit || def_disk_limit;
            };
        },
        memoize: function() {
            if (!replaced) {
                replaced = window[formula];
                window[formula] = function(n) {
                    var result;
                    if (n >= disk_limit) {
                        result = null;
                    } else if (n >= mem_limit) {
                        result = Number(localStorage.getItem(disk_keys_pref + n));
                    } else {
                        result = memoized[n];
                    };
                    if (result === undefined || result === null || result === "" || isNaN(result)) {
                        result = replaced(n);
                        if (n >= disk_limit) {
                            ;
                        } else if (n >= mem_limit) {
                            localStorage.setItem(disk_keys_pref + n, result);
                        } else {
                            memoized[n] = result;
                        };
                    };
                    return result;
                };
            };
        },
        unmemoize: function() {
            if (replaced) {
                window[formula] = replaced;
                replaced = null;
            };
        },
        clearMemVals: function() {
            memoized = [];
        },
        clearDiskVals: function() {
            var key_array = Object.keys(localStorage).filter(
                function(obj) {
                    return obj.match(disk_keys_re);
                }
            );
            for (var i = 0; i < key_array.length; i++) {
                delete(localStorage[key_array[i]]);
            };
        }
    };
    // The next lines are so we use defaults if vals are empty, or override if no localStorage, etc
    obj.setMemLimit(mem_limit);
    obj.setDiskLimit(disk_limit);
    return obj;
};
