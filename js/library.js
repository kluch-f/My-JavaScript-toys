$(function () {
    width = screen.availWidth;
    height = screen.availHeight;

    var r = Raphael("chart", width, height);

    var clock = {
        outsideCircle: r.circle(0, 0, 0).attr({fill: "#FFF0F5", stroke:"#FFF0f9"}),
        insideCircle: r.circle(0, 0, 0).attr({fill: "#CDC1C5", stroke:"#CDC1d5"}),
        appearanceTime: 300
    }

    $(document).click(function(e){
        clock.insideCircle
            .attr({cx:e.pageX, cy:e.pageY})
            .animate({r: 40}, clock.appearanceTime);
        clock.outsideCircle
            .attr({cx:e.pageX, cy:e.pageY})
            .animate({r: 60}, clock.appearanceTime);

        $(document).unbind('click');
    });

});