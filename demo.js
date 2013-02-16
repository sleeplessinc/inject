

// simple injection
Inject.replicate( data.menudata, "menuitem" );

// reset and re-inject
// Note you have to save off the object returned by replicate()
// and pass it back in to reset() or rere().
orig = Inject.replicate( data.first, "protodiv" );

// Nested injections.
// This also demonstrates the callback parameter which is called for each replicated element
var sec = $("#sec_tmpl").get(0);
Inject.replicate( data.subdata, "sec_tmpl", function( el, hash ) {
	// here we use jquery to help out by finding the sub-element
	// to "el" that we want to replicate "within" this replication
	Inject.replicate( hash.list_tmpl, $(el).find("ul").get(0) );
});


setTimeout(function() {
	// This timeout fires after a few sections to show how you reset.
	// rere() is just shorthand for:
    //	 	Inject.reset( orig );
    //		Inject.replicate( arr, orig, cb );
	Inject.rere( data.second, orig )
}, 3000)


$(document.body).removeClass("hid");


