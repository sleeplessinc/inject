
/*
Copyright 2013 Sleepless Software Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
*/


Inject = {}

Inject.elem = function( v ) {
	if( typeof v === "string" )
		return document.getElementById( v );
	if( v instanceof HTMLElement )
		return v;
	return document.body;
}

Inject.substitute = function(s, hash) {
	for( var key in hash ) {
		if( typeof hash[ key ] === "string" ) {
			re = new RegExp( "__"+key+"__", "g" );
			s = s.replace( re, hash[ key ] );
		}
	}
	return s;
}

Inject.inject = function( elem, hash ) {

	var e = Inject.elem( elem );

	e.innerHTML = Inject.substitute( e.innerHTML, hash );

	for( var i = 0; i < e.attributes.length; i++ ) {
		a = e.attributes[ i ];
		var x = a.textContent ? 'textContent' : 'value';
		a[ x ] = Inject.substitute( a[ x ], hash );
	}

	return e;
}


Inject.replicate = function( arr, orig, cb ) {

	if( !( arr instanceof Array ) )
		arr = [ arr ];

	if( typeof orig === "function" ) {
		cb = orig;
		orig = document.body;
	}
	else {
		orig = Inject.elem( orig );
	}

	var sib = orig.nextSibling; 	// can be null
	orig.sib = sib;
	var mom = orig.parentNode;
	orig.mom = mom;

	orig.remove();		// take out of dom

	orig.clones = [];	// for storing refs to the clones

	var l = arr.length
	for( var i = 0; i < l; i++ ) {

		var a = arr[i];

		var e = orig.cloneNode( true );
		delete e.id;

		orig.clones.push( e );

		mom.insertBefore(e, sib);

		Inject.inject(e, a);

		if( cb ) {
			cb( e, a );
		}
	}

	return orig;
}

Inject.reset = function( orig ) {

	if( ! orig )
		return;

	var clones = orig.clones;
	if( ! clones )
		return;

	//var l = clones.length;
	//if( l < 1 )
	//	return;
	
	// replace original element
	orig.mom.insertBefore( orig, clones[ 0 ] || null );

	// remove the clones
	for( var i = 0; i < l; i++ ) {
		clones[ i ].remove();
	}
}

Inject.rere = function( arr, orig, cb ) {
    Inject.reset( orig );
    return Inject.replicate( arr, orig, cb );
}


