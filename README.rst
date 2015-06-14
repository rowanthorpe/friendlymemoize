Resource Friendly Memoize
-------------------------

This little lib doesn't strive to be much more than a POC, resulting from an
afternoon hackup of an idea I had while teaching myself about some javascript
internals (having learned many obscure languages over the years, I have hit
that unavoidable point where familiarity with popular languages has to now get
more airtime, at the cost of playing with the languages I prefer - like lisp).
If you want a large, robust production-ready memoizer I recommend using one of
the hundreds of other libs available in the wild which deal with sync/async,
serialisation, promisified functions, weather anomalies, etc. I just wrote this
lib to be small, easy to read/audit, and do the one thing it does (and I didn't
want to spend more than an afternoon on it).

The actual lib - friendlymemoize.js - is a "resource-friendly" memoizer with:

* reconfigurable mem-usage-limit - before dropping to memoizing to disk if
  available (using localStorage)
* configurable disk-usage-limit - before dropping to not memoizing at all
* some other useful get/set/clear methods

Just pass the name of the formula (defined as a global function) to
FriendlyMemoize() and call the following methods on the resulting object to
affect what happens when you run the function by its normal name:

* memoize()
* unmemoize()
* getFormula()
* getMemLimit()
* getDiskLimit()
* setMemLimit()
* setDiskLimit()
* clearMemVals()
* clearDiskVals()

To test the lib there is friendlymemoize-test.js which should be loaded after
the lib, and logs output to console for various uses for the factorial formula.
The easiest way is to open the test-page.html (which loads both scripts) in a
browser and open the javascript console to follow the output.

Although I probably won't try to turn this into much more than it already is, I
welcome any bug-reports, criticisms, improvements, etc (with what free time I
can spare).

For any such communication go to:

https://github.com/rowanthorpe/friendlymemoize
