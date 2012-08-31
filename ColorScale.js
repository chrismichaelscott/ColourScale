ColorScale = function(startColor, endColor, startValue, endValue) {
	
	if ( typeof(startColor) != "string" || typeof(endColor) != "string") {
		throw new Error("Could not establish the extreme colours for the scale. The 1st and 2nd agruments to the constructor must be strings.");
	}
	
	if ( typeof(startValue) != "number" || typeof(endValue) != "number") {
		throw new Error("Could not establish the upper and lower bounds of values for the colour scale. The 3rd and 4th agruments to the constructor must be numbers.");
	}

	function decimalToHex(d) {
		var hex = Number(d).toString(16);
		
		while (hex.length < 2) {
			hex = "0" + hex;
		}
	
		return hex;
	}
	
	function startsWith(str, prefix) {
		return str.slice(0, prefix.length) == prefix;
	};

	if (startsWith(startColor, "#") && startColor.length == 7) {
		this.startColor = {
				r: parseInt(startColor.substring(1,3), 16),
				g: parseInt(startColor.substring(3,5), 16),
				b: parseInt(startColor.substring(5,7), 16)	
		};		
	} else if (startColor.match(/rgb\( *[0-9]+ *, *[0-9]+ *, *[0-9]+ *\)/)) {
		var components = startColor.split(",");
		this.startColor = {
				r: parseInt(components[0].replce("rgb(", "")),
				g: parseInt(components[1]),
				b: parseInt(components[2].replace(")", ""))	
		};
	} else {
		throw new Error("Could not parse start colour... only #404040 and rgb(100, 100, 20) formats are supported");
	}
	
	if (startsWith(endColor, "#") && endColor.length == 7) {
		this.colorRange = {
				r: parseInt(endColor.substring(1,3), 16) - this.startColor.r,
				g: parseInt(endColor.substring(3,5), 16) - this.startColor.g,
				b: parseInt(endColor.substring(5,7), 16) - this.startColor.b
		};		
	} else if (endColor.match(/rgb\( *[0-9]+ *, *[0-9]+ *, *[0-9]+ *\)/)) {
		var components = endColor.split(",");
		this.colorRange = {
				r: parseInt(components[0].replace("rgb(", "")) - this.startColor.r,
				g: parseInt(components[1]) - this.startColor.g,
				b: parseInt(components[2].replace(")", "")) - this.startColor.b
		};
	} else {
		throw new Error("Could not parse end colour... only #404040 and rgb(100, 100, 20) formats are supported");
	}
	
	this.startValue = startValue;
	this.range = endValue - startValue;
	
	this.getColor = function(value) {
		var relativeProportion = (value - this.startValue) / this.range;
		if (relativeProportion < 0) relativeProportion = 0;
		if (relativeProportion > 1) relativeProportion = 1;
		
		var newColor = {
				r: parseInt(this.startColor.r + (this.colorRange.r * relativeProportion)),
				g: parseInt(this.startColor.g + (this.colorRange.g * relativeProportion)),
				b: parseInt(this.startColor.b + (this.colorRange.b * relativeProportion))
		};
		
		return '#' + decimalToHex(newColor.r) + decimalToHex(newColor.g) + decimalToHex(newColor.b);
	};
};