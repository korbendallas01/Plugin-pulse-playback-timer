/********************************
Pulse timer plugin
*********************************/

(function(P) {

	P.plugin.koken_pulse_timer = function(options) {

		var	diameter	= options && options.koken_pulse_timer_radius || 32,
			radius		= diameter / 2,
			weight		= options && options.koken_pulse_timer_weight || 3,
			type		= options && options.koken_pulse_timer_style || 'beam',
			countdown	= options && options.koken_pulse_timer_countdown || false,
			l			= Number(diameter) + Number(weight),
			self		= this,
			position	= (options && options.koken_pulse_timer_position || 'top right').toLowerCase().split(' '),
			vertical	= position[0],
			horizontal	= position[1] || 'center',
			color		= options && options.koken_pulse_timer_color || 'white',
			bgcolor		= options && options.koken_pulse_timer_bgcolor || 'rgba(0,0,0,.6)',
			showing		= false,
			css			= { position: 'absolute' };

		var progress = $('<canvas/>')
							.attr({
								width: l,
								height: l
							})
							.css( css ),
			ctx			= progress[0].getContext('2d');

		this.on( 'transitionend', function(e) {

			progress.remove();

			switch(vertical) {
				case 'bottom':
					css.bottom = 5;
					break;

				case 'center':
					css.top = '50%';
					css.marginTop = -(l/2);
					break;

				default:
					css.top = 10;
					break;
			}

			switch(horizontal) {
				case 'left':
					css.left = 10;
					break;

				case 'center':
					css.left = '50%';
					css.marginLeft = -(l/2);
					break;

				default:
					css.right = 5;
					break;
			}

			css.display = 'none';

			progress.css(css);
			e.dom.find('.pulse-content-ui-container').append( progress );
		});

		this.on( 'ended transitionstart videobegin', function() {
			progress.remove();
			showing = false;
		});

		progress.on( 'click', function() {
			self.trigger('toggle');
		});

		this.on( 'playbacktimer', function(e) {

			if (e.totalItems <= 1) { return false; }

			var devicePixelRatio = window.devicePixelRatio || 1,
				backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
									ctx.mozBackingStorePixelRatio ||
									ctx.msBackingStorePixelRatio ||
									ctx.oBackingStorePixelRatio ||
									ctx.backingStorePixelRatio || 1,
				ratio = devicePixelRatio / backingStoreRatio;

			if (devicePixelRatio !== backingStoreRatio) {
				progress[0].width = l*ratio;
				progress[0].height = l*ratio;

				progress.css('width', l);
				progress.css('height', l);

				ctx.scale(ratio, ratio);
			}

			var p = (e.total - e.remaining)/e.total;
			ctx.clearRect(0, 0, l, l);

			if (type === 'bobber') {
				var r = radius - weight;
				ctx.beginPath();
				ctx.arc(radius, radius, r - (r*p), 0, Math.PI*2, false);
				ctx.fillStyle = color;
				ctx.fill();
			} else if (type === 'beam') {
				ctx.beginPath();
				ctx.arc(radius, radius, radius - weight, Math.PI/180 * 270, Math.PI/180 * 269.9, false);
				ctx.lineWidth = weight;
				ctx.strokeStyle = bgcolor;
				ctx.stroke();

				ctx.beginPath();
				if ( p < 1 ) {
					ctx.arc(radius, radius, radius - weight, Math.PI/180 * 270, Math.PI/180 * (359.9999*p - 90), countdown);
				} else if (!countdown) {
					ctx.arc(radius, radius, radius - weight, 0, Math.PI*2, false);
				}
				ctx.lineWidth = weight;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.beginPath();
				if ( p < 1 ) {
					ctx.arc(radius, radius, radius - weight, Math.PI/180 * 270, Math.PI/180 * (359.9999*p - 90), countdown);
					ctx.lineTo(radius, radius);
				} else if (!countdown) {
					ctx.arc(radius, radius, radius - weight, 0, Math.PI*2, false);
				}
				ctx.fillStyle = color;
				ctx.fill();
			}

			if ( !showing ) {
				progress.fadeIn(250);
				showing = true;
			}

		});

		// Always return this to keep chaining intact
		return this;

	};

})(Pulse);