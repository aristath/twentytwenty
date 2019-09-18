/**
 * Color Calculations.
 *
 * @since 1.0.0
 *
 * @param {string} backgroundColor - The background color.
 * @param {Number} accentHue - The hue for our accent color.
 *
 * @return {Object} - this
 */
function _twentyTwentyColor( backgroundColor, accentHue ) {

	// Set the object properties.
	this.backgroundColor = backgroundColor;
	this.accentHue       = accentHue;
	this.bgColorObj      = new Color( backgroundColor );
	this.textColorObj    = this.bgColorObj.getMaxContrastColor();
	this.textColor       = this.textColorObj.toCSS();
	this.isDark          = this.bgColorObj.toLuminosity() < 0.5;
	this.isLight         = ! this.isDark;

	// Return the object.
	return this;
}

/**
 * Builds an array of Color objects based on the accent hue.
 * For improved performance we only build half the array
 * depending on dark/light background-color.
 *
 * @since 1.0.0
 *
 * @return {Object} - this
 */
_twentyTwentyColor.prototype.setAccentColorsArray = function() {
	var minSaturation    = 40,
		maxSaturation    = 100,
		minLightness     = this.isDark ? 40 : 0,
		maxLighness      = this.isDark ? 100 : 60,
		stepSaturation   = 4,
		stepLightness    = 4,
		s, l, colorObj;

	this.accentColorsArray = [];

	// We're using `for` loops here because they perform marginally better than other loops.
	for ( s = minSaturation; s <= maxSaturation; s += stepSaturation ) {
		for ( l = minLightness; l <= maxLighness; l += stepLightness ) {
			colorObj = new Color( {
				h: this.accentHue,
				s: s,
				l: l
			} );

			this.accentColorsArray.push( {
				color: colorObj,
				contrastBackground: colorObj.getDistanceLuminosityFrom( this.bgColorObj ),
				contrastText: colorObj.getDistanceLuminosityFrom( this.textColorObj )
			} );
		}
	}
	return this;
};

/**
 * Get accessible text-color.
 *
 * @since 1.0.0
 *
 * @return {Color} - Returns a Color object.
 */
_twentyTwentyColor.prototype.getTextColor = function() {
	return this.textColor;
};

 /**
 * Get accessible color for the defined accent-hue and background-color.
 *
 * @since 1.0.0
 * @return {Color} - Returns a Color object.
 */
_twentyTwentyColor.prototype.getAccentColor = function() {
	var i, colorFound,
		self       = this,
		findColors = function( minBgContrast, minTxtContrast ) {
			var i;
			for ( i = 0; i < self.accentColorsArray.length; i++ ) {
				if ( self.accentColorsArray[ i ].contrastBackground >= minBgContrast && self.accentColorsArray[ i ].contrastText >= minTxtContrast ) {
					return self.accentColorsArray[ i ];
				}
			}
		},
		// The rules below go from good to not so good.
		// A loop will run through the item so we'll first get the good colors
		// and if that fails we'll move on to the next case.
		// Each item in the array is formatted [minBackgroundContrast, minSurroundingTextContrast].
		rules = [
			[ 7, 3 ],
			[ 6, 3 ],
			[ 5, 3 ],
			[ 4.5, 3 ],
			[ 4.5, 2 ],
			[ 4, 3 ],
			[ 4, 2 ],
			[ 3, 3 ],
			[ 3, 2 ]
		];

	for ( i = 0; i < rules.length; i++ ) {
		colorFound = findColors( rules[ i ][0], rules[ i ][1] );
		if ( colorFound ) {
			return colorFound.color;
		}
	}

	// Fallback.
	return new Color( 'hsl(' + this.accentHue + ',50%,50%)' );
};

/**
 * Return a new instance of the _twentyTwentyColor object.
 *
 * @since 1.0.0
 * @param {string} backgroundColor - The background color.
 * @param {Number} accentHue - The hue for our accent color.
 * @return {Object} - this
 */
function twentyTwentyColor( backgroundColor, accentHue ) {
	var color = new _twentyTwentyColor( backgroundColor, accentHue );
	color.setAccentColorsArray();
	return color;
}