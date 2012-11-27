$(function () {
    width = screen.availWidth;
    height = screen.availHeight;

    var r = Raphael("chart", width, height);

    var clock = {
        outsideCircle: r.circle(0, 0, 0).attr({fill: "#FFF0F5", stroke:"#FFF0f9"}),
        insideCircle: r.circle(0, 0, 0).attr({fill: "#CDC1C5", stroke:"#CDC1d5"}),
        appearanceTime: 300,
        dialCircle: {},
        createClockDial: function(str) {
            var scaleDivision = 4, length, number = 0, dial = new Array(),
                angle = 0 - 90;
            switch (str) {
                case 'low':
                    scaleDivision = 4; break;

                case 'high':
                    scaleDivision = 12; break;

                default: break;
            }
            this.dialCircle.r = (this.outsideCircle.attr('r') + this.insideCircle.attr('r')) / 2;
            length = 12 / scaleDivision;
            for (var i = 0; i < scaleDivision; i++) {
                number += length;
                angle += 360 / scaleDivision;
                var item = r.text(
                    this.outsideCircle.attr('cx') + Math.cos(angle/180 * Math.PI) * this.dialCircle.r,
                    this.outsideCircle.attr('cy') + Math.sin(angle/180 * Math.PI) * this.dialCircle.r,
                    number);
                dial.push(item);
            }
        }
    }

    $(document).click(function(e){
        clock.insideCircle
            .attr({cx:e.pageX, cy:e.pageY})
            .animate({r: 40}, clock.appearanceTime);
        clock.outsideCircle
            .attr({cx:e.pageX, cy:e.pageY})
            .animate({r: 60}, clock.appearanceTime, function () {
                clock.createClockDial('low');
            });


        $(document).unbind('click');
    });

});