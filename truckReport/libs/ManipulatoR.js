//------------------------------------------------------
//					DESCRIPTION
//------------------------------------------------------
//------------------------------------------------------
// FUNCTIONS NEEDED:
//
// Subset array of objects. For example, take three keys from all data.
// Make a flat data from hierarchical JSON
//
//------------------------------------------------------

//------------------------------------------------------
//					Working place
//------------------------------------------------------
// ALL ARRAYS SHOULD BE EQUAL LENGTH
function matrix() {
	return arguments;
}

// NOT COMPLETE. NEED TO TEST EACH ARGUMENTS LENGTH
 function dataFrame() {
	var obj = {}, out = [];
	for(i in arguments[0]) {
		obj = {};
		for(j in arguments) obj["x" + j] = arguments[j][i];
		out.push(obj);
	}
	return out;
}

// NOT COMPLETE: Check if new keys length os the same.
function names(df, keys) {
	if(typeof keys === "undefined") {
		var k = []
		for(i in df[0]) k.push(i)
		return k
	} else{
		var arr = []
		for(i in df) {
			var h = 0, o = {}
			for(j in df[i]) { o[keys[h]] = df[i][j]; h++ }
			arr.push(o)
		}
		return arr
	}
}


//------------------------------------------------------
//					Completed functions
//------------------------------------------------------
// Make sequence of numbers
function seq(start, finish, by) {
	by = by || 1;
	var out = [], i = 0,
		s = +start, f = +finish;
	for(i=s; i<=f; i=i+by) out.push(i);
	return out;
}

// Generate N random numbers between min and max 
function runif(N, min, max) {
	var out = [];
	for(i in seq(1, N)) out.push(Math.floor(Math.random() * max) + min);
	return out;
}

// Repeat x
function rep(x, frequency) {
	var out = [];
	for(i in seq(1, frequency)) out.push(x);
	return out;
}

// Make a query for crossfilter.js
function cfQuery(values) {
	var q = paste("d == ", values).join(' || ')
	return q;
}

function list() {
	return arguments;
}

//------------------------------------------------------
//					Almost completed functions
//------------------------------------------------------
// Return unique values in array. NOT COMPLETE: WORKS ONLY WITH NUMBERS
function unique(arr) {
    return Object.keys(arr.reduce(function(o, x) {o[x]=1; return o;}, {})).map(Number);
}
// !!! NOT COMPLETE Take N arrays or elemets and merge them as strings. Return array with length of the longest input member.
function paste(string1, array) {
	var arrLen = array.length,
		out = [];
	for(i=0; i<arrLen; i++) {
		var newStr = string1 + array[i];
		out.push(newStr);
	}

	return out;
}
//------------------------------------------------------
//						Wishlist
//------------------------------------------------------
// Take an array and a list of indexes. Return a subset.
// function subsetByIndex(array, index) {}
// 
// function sample() {}
// 
// function rnorm() {}
// 
// function completeCases() {}
// 
// function which() {}
// 

// 
// function matrixToDataframe(matrix) {
// 	for(i in matrix) {
// 		matrix[i]
// 	}
// }
// 
// 
// function arrayToObject()
// Print dataFrame and matrix in readable format

// function lapply() {}
// function round(data, decimal) {}









//------------------------------------------------------
//						Unsorted
//------------------------------------------------------
// Take an array and apply a function to each element. R style Apply function. apply keyword is reserved by javascript, so we use japply
function japply(x, func) {
	return x.map(function(d) { return func(d) });
}

// Get selected data from array of objects
function getKey(data, key) {
	if((typeof key === "string") === false) { throw new TypeError("Error: key must be a string") };
	var val = data.map(function(d) { return d[key] });

	return val;
}

// Get attr from array of DOMs
function getAttr(data, key) {
	if((typeof key === "string") === false) { throw new TypeError("Error: key must be a string") };
	var val = data.map(function() { return $(this).attr(key) });

	return val.toArray();
}

// Convert array of strings to array of numbers
function arrayAsNumeric(x) {
	var out = x.map(function(item, index) { return window.parseInt(item) });

	return out;
}

// Take M arrays with length N each and make array of N objects. Each object has M keys.
function makeObject(data, key) {
	var arr = [];
	for(i in data){
		var o = {};
		for(j in key) o[key[j]] = data[i][j]
		arr.push(o)
	}

	return arr;
}

// Take M arrays with length N each and make array of N arrays. Each array is M length.
function arraysToArray(data) {
	var arr = [];
	for(i=0; i<data[0].length; i++) {
		var arrA = [];
		for(j=0; j<data.length; j++){
			arrA.push(data[j][i]);
		}
		arr.push(arrA);
	}

	return arr;
}

// !!! REMOVE THIS Take array of elements and add # to every element.
function mergeStrings(str) {
	var newStr = "#" + str;
	return newStr;
}

//------------------------------------------------------
//					Math functions
//------------------------------------------------------

// Add up two numeric arrays with the same length.
function addition() {
	// Check if all arguments are arrays
	var len = arguments.length, i = 0, result = 0;
	if(arguments[0] instanceof Array) {
		i = 0; result = 0;
		while(i < len) {
			result += arguments[i] instanceof Array
			i++;
		}
		if(result != len) { throw new TypeError("Error: summing arrays but not all elements are arrays") }
	}
	// Check if all arguments are numbers
	if(typeof Number(arguments[0]) === "number") {
		i = 0; result = 0;
		while(i < len) {
			result += typeof Number(arguments[i]) === "number"
			i++;
		}
		if(result != len) { throw new TypeError("Error: summing numbers but not all elements are numbers") }
	}
	// Check if all arrays are the same length


	// Sum simple numbers
	if(len > 1 && typeof Number(arguments[0]) === "number" && !(arguments[0] instanceof Array)) {
		i = 0; result = 0;
		while(i < len) {
			result += Number(arguments[i])
			i++;
		}
		return result;
	}
	// Sum one array
	if(len === 1 && arguments[0] instanceof Array) {
		i = 0; result = 0;
		while(i < arguments[0].length) {
			result += Number(arguments[0][i]);
			i++;
		}
		return result;
	}
	// Sum multiple arrays
	if(len > 1 && arguments[0] instanceof Array) {
		i = 0; result = rep(0, arguments[0].length);
		while(i < len) {
			arguments[i].map(function(d,i) { return result[i] += d })
			i++
		}
		return result;
	}
}

// Subtract two numeric arrays with the same length.
function subtract(arr1, arr2) {
		// Check if all arguments are arrays
	var len = arguments.length, i = 0, result = 0;
	if(arguments[0] instanceof Array) {
		i = 0; result = 0;
		while(i < len) {
			result += arguments[i] instanceof Array
			i++;
		}
		if(result != len) { throw new TypeError("Error: subtracting arrays but not all elements are arrays") }
	}
	// Check if all arguments are numbers
	if(typeof Number(arguments[0]) === "number") {
		i = 0; result = 0;
		while(i < len) {
			result += typeof Number(arguments[i]) === "number"
			i++;
		}
		if(result != len) { throw new TypeError("Error: subtracting numbers but not all elements are numbers") }
	}
	// Check if all arrays are the same length



	// Subtract simple numbers
	if(len > 1 && typeof Number(arguments[0]) === "number" && !(arguments[0] instanceof Array)) {
		i = 1; result = arguments[0];
		while(i < len) {
			result -= Number(arguments[i])
			i++;
		}
		return result;
	}
	// Subtract one array
	if(len === 1 && arguments[0] instanceof Array) {
		i = 1; result = arguments[0][0];
		while(i < arguments[0].length) {
			result -= Number(arguments[0][i]);
			i++;
		}
		return result;
	}
	// Subtract multiple arrays
	if(len > 1 && arguments[0] instanceof Array) {
		i = 1; result = arguments[0];
		while(i < len) {
			arguments[i].map(function(d,i) { return result[i] -= d })
			i++;
		}
		return result;
	}
}

// Multiply two numeric arrays with the same length.
function multiply(arr1, arr2) {
	var result = arr1.map(function(d,i) { return parseInt(arr1[i]) * parseInt(arr2[i]) })
	return result;
}

// Multiply two numeric arrays with the same length.
function divide(arr1, arr2) {
	var result = arr1.map(function(d,i) { return parseInt(arr1[i]) / parseInt(arr2[i]) })
	return result;
}

// Square root
function root(arr) {
	var result = arr.map(function(d,i) { return Math.sqrt(d) })
	return result;
}



// Find distance between two arrays of points. Arrays must be 2D have the same length.
function distance(coor1, coor2) {
	var a = subtract(coor1[0], coor2[0]),
		b = subtract(coor1[1], coor2[1]),
		c = multiply(a, a),
		d = multiply(b, b),
		e = root(addition(c, d));

	return e
}

// Find minimum array element and its index.
function findMin(arr) {
	//var arr = arr.toArray();
	var min = Math.min.apply( Math, arr );
	var ind = arr.indexOf(min)

	return [min, ind]
}

function dumb(){
	x = 415
	x = x.toString()
	l = x.length

	res = []
	for(i in seq(0, l)){

		sDigit = x.slice(i, ++i)
		console.log([i, ++i, sDigit])

		for(j in seq(0,9)){
			if(j === sDigit){
				res.push(j);
			}
		}

	}

	res = parseInt(res.join(""))
}

// Filter array of objects by array of values
function filterByArray(data, values, attr) {
	var result = [];
	for(i=0; i<values.length; i++) {
		var a = data.filter(function(d) { return d[attr] === values[i] })
		result.push(a)
	}

	return d3.merge(result)
}



console.log("ManipulatoR.js loaded!")


function V(initial_val){
  if(!(this instanceof V)){
    return new V(initial_val);
  }

  this.e = initial_val || 0;

  return this.e
}

V.prototype = {
	add: function(_) {
		this.e = this.e + _
		return this
	},

	minus: function() {
		console.log(this)
		return this
	}
}