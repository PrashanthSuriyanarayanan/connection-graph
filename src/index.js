/*
  TODO:
    - Separate renderer logic from data preparation
    - Add animations
    - Improve canvas playground
    - Add demos
*/
;( function ( $, window, document, undefined ){
	'use strict';
	
	$.fn.cns = function ( config ) {

		var options = $.extend( require('./config.js'), config ),
			Node = require('./node.js'),
			Line = require('./line.js'),
			canvas = this[0],
			ctx = canvas.getContext('2d'),
			w = canvas.width/2,
			h = canvas.height/2;

    	ctx.globalCompositeOperation = 'destination-over';

    	this[0].parentNode.scrollTop = h - window.innerHeight/2;
    	this[0].parentNode.scrollLeft = w - window.innerWidth/2;

		render();

		function renderPartialConnections ( list, radius, step, angle ) {
			list.forEach( function ( obj ) {
				var text = obj.name,
					xText = ctx.measureText(text).width,
					x = w + radius * Math.cos(angle), 
					y = h + radius * Math.sin(angle), 
					childNode = new Node(),
					connector = new Line();

		        childNode.ctx = ctx;
		        childNode.options = options.cNode;
		        childNode.options.radius = xText/1.5;
		        childNode.options.x = x;
		        childNode.options.y = y;
		        childNode.options.name = text;

		        connector.ctx = ctx;
		        connector.options = options.line;
		        connector.options.x = x;
		        connector.options.y = y;
		        connector.options.w = w;
		        connector.options.h = h;

		        childNode.draw();
		        connector.draw();

				angle += step;
			});
		}

        function sortConnections () {
			options.data.connections.sort( function ( prev, next ) {
				return ctx.measureText(prev.name).width - ctx.measureText(next.name).width;
			});
		}

		function render () {
			var step,
				prevStep = 0,
				occupiedSpace = 0,
				biggestNodeSize = 0,
				currentDataCircle = [],
				antiClockWise = false, 
				distAccumulator = 1.5, 
				radius = 120,
				circumference = 2 * Math.PI * radius,
				parentNode = new Node();

	        parentNode.ctx = ctx;
	        parentNode.options = options.pNode;
	        parentNode.options.radius = ctx.measureText(options.data.name).width * 2;
	        parentNode.options.x = w;
	        parentNode.options.y = h;
	        parentNode.options.name = options.data.name;

	        parentNode.draw();

			sortConnections();

			options.data.connections.forEach( function ( data, key ) {
				var text = data.name,
					xText = ctx.measureText(text).width;

		        occupiedSpace += xText * 2;
		        biggestNodeSize = biggestNodeSize > xText ? biggestNodeSize : xText;

		        if( circumference <= occupiedSpace ) {
		        	step = ( 2 * Math.PI ) / ( key - prevStep );
		        	prevStep = key;

		        	antiClockWise = !antiClockWise;
	        		step = antiClockWise ? -step : step;
		        	
		        	radius += biggestNodeSize;
		        	renderPartialConnections( currentDataCircle, radius, step, 0 );

		        	radius += biggestNodeSize * 1.5;
		        	occupiedSpace = 0;
		        	circumference = 2 * Math.PI * radius;
		        	currentDataCircle.length = 0;
		        }
		        currentDataCircle.push( data );
			
			});

			if( currentDataCircle.length > 0 ) {
				radius += biggestNodeSize / 1.5;
				step = ( 2 * Math.PI ) / ( options.data.connections.length - prevStep );

				antiClockWise = !antiClockWise;
	        	step = antiClockWise ? -step : step;
	        	renderPartialConnections( currentDataCircle, radius, step, 0 );	
			}
			
		}

	};
})( jQuery, window, document );
