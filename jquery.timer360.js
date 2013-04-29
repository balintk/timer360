(function($) {

  'use strict';

  $.fn.timer360 = function (options) {
    var settings = jQuery.extend({
      radius        : 15.5,
      fillColor     : '#fcf8e3',
      strokeColor   : '#d9edf7',
      strokeWidth   : 3,
      interval      : 10,
      onComplete    : Function
    }, options);

    settings.width = (settings.radius * 2) + (settings.strokeWidth * 2);
    settings.height = settings.width;
    settings.arcX = settings.radius + settings.strokeWidth;
    settings.arcY = settings.arcX;

    return this.each(function () {
      var canvas = $(this)[0];
      var interval = settings.interval;
      var start = null;

      start = startClock(null);

      // Get context for the canvas and create the initial circle.
      var pen = canvas.getContext('2d');
      pen.lineWidth = settings.strokeWidth;
      pen.strokeStyle = settings.strokeColor;
      pen.fillStyle = settings.fillColor;
      pen.clearRect(0,0,settings.width, settings.height);
      drawTimer(Math.PI*2, false);

      function tick (amount) {
        interval = setInterval(function() {
          var now = new Date();
          var secondsElapsed = Math.round((now.getTime() - start.getTime())/1000);
          var incrementAmount = (Math.PI*2)/((amount*60)*1000);

          pen.clearRect(0,0,settings.width, settings.height);
          drawTimer(Math.PI*2, false);
          if ((secondsElapsed) < (amount*60)) {
            drawTimer(incrementAmount*(secondsElapsed*1000), true);
          }
          else {
            drawTimer(Math.PI*2, true);
            clearInterval(interval);
            settings.onComplete();
          }
        }, 1000);
      }

      function drawTimer (endAngle, drawStroke) {
        pen.beginPath();
        pen.arc(settings.arcX,settings.arcY,settings.radius,endAngle,0,true);
        pen.fill();
        if (drawStroke) { pen.stroke(); }
      }

      function startClock (clock) {
        var start = new Date();
        tick(settings.interval/60);
        return start;
      }

    });
  };

})(jQuery);
