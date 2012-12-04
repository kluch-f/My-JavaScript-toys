$(function () {
    width = screen.availWidth;
    height = screen.availHeight;

    var r = Raphael("chart", width, height);

    var clock = {
        outsideCircle: r.circle(0, 0, 0).attr({fill: "#FFF0F5", stroke:"#FFF0f9"}),
        insideCircle: r.circle(0, 0, 0).attr({fill: "#CDC1C5", stroke:"#CDC1d5"}),
        point:{x: 0, y: 0},
        appearanceTime: 300,
        dialCircle: {},
        pointers: {},
        getPointerEnd: function (length, time1, time2, divider){
            var angle =  (divider) ? 30 : 6;
            divider = (divider)? divider : 1;
            time2 = (time2) ? time2 : 0 ;

            var getTime = function() {
                return ((divider == 1) ? time1 : (time1% divider)) + time2 * 100/60 * 0.01;
            }

            return {
                x: length * Math.cos((getTime() * angle - 90)/ 180 * Math.PI),
                y: length * Math.sin((getTime() * angle - 90)/ 180 * Math.PI)
            }
        },
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

        },
        createPointers: function(){
            var now = new Date();
            this.hourPointerLength = this.outsideCircle.attr('r') / 2;
            this.minutePointerLength = this.outsideCircle.attr('r') * 0.75;
            var getHours = function (date) {
                return date.getHours() % 12 + date.getMinutes() * 100/60 * 0.01;
            }

            l = this.getPointerEnd(this.hourPointerLength,now.getHours(), now.getMinutes(), 12);

            this.pointers.hour = r.path([
                "M",
                this.point.x,
                this.point.y,
                "l",
                l.x,
                l.y
            ]);

            this.pointers.hour.attr({fill: '#51f', stroke: '#555', 'stroke-width': 5});

            l = this.getPointerEnd(this.minutePointerLength,now.getMinutes(), now.getSeconds());
            this.pointers.minute = r.path([
                "M",
                this.point.x,
                this.point.y,
                "l",
                l.x,
                l.y
            ]);
            this.pointers.minute.attr({fill: '#51f', stroke: '#444', 'stroke-width': 3});

            l = this.getPointerEnd(this.minutePointerLength,now.getSeconds());
            this.pointers.second =  r.path([
                "M",
                this.point.x,
                this.point.y,
                "l",
                l.x,
                l.y
            ]);
            this.pointers.second.attr({fill: '#51f', stroke: '#333', 'stroke-width': 1});
        },
        pointersStart: function() {

            //alert(pathSeconds);
            $this = this;

            this.pointers.second.loop = setInterval(
                function() {
                    var now = new Date();
                    var l = $this.getPointerEnd($this.minutePointerLength, now.getSeconds());
                    var pathSeconds = [
                        "M",
                        $this.point.x,
                        $this.point.y,
                        "l",
                        l.x,
                        l.y
                    ];
                    $this.pointers.second.animate({path: pathSeconds},10);
                },
                990
            )

            this.pointers.minute.loop = setInterval(
                function() {
                    var now = new Date();
                    var l = $this.getPointerEnd($this.minutePointerLength, now.getMinutes(), now.getSeconds());
                    var pathMinutes = [
                        "M",
                        $this.point.x,
                        $this.point.y,
                        "l",
                        l.x,
                        l.y
                    ];
                    $this.pointers.minute.animate({path: pathMinutes},10);
                },
                1000 * 29 + 990
            )

            this.pointers.hour.loop = setInterval(
                function() {
                    var now = new Date();
                    var l = $this.getPointerEnd($this.hourPointerLength, now.getHours(), now.getMinutes(), 12);
                    var pathHours = [
                        "M",
                        $this.point.x,
                        $this.point.y,
                        "l",
                        l.x,
                        l.y
                    ];
                    $this.pointers.hour.animate({path: pathHours},10);
                },
                1000 * 29 + 990
            )


        }
    }

    $(document).mousemove(function(e){
        $("#clock-tip").css({
            left:e.pageX,
            top:e.pageY
        });
    })
    $(document).click(function(e){

        $(document).unbind('mousemove');
        $("#clock-tip").hide();

        clock.insideCircle
            .attr({cx:e.pageX, cy:e.pageY})
            .animate({r: 40}, clock.appearanceTime);
        clock.outsideCircle
            .attr({cx:e.pageX, cy:e.pageY})
            .animate({r: 60}, clock.appearanceTime, function () {
                clock.createClockDial('high');
                clock.point = {
                    x:e.pageX,
                    y:e.pageY
                };
                clock.createPointers();
                clock.pointersStart();
            });



        $(document).unbind('click');
    });

});