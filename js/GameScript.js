/**
 * Created with JetBrains PhpStorm.
 * User: Dasha
 * Date: 06.12.12
 * Time: 23:01
 * To change this template use File | Settings | File Templates.
 */

$().ready(function(){
    (function() {
        Raphael.fn.addGuides = function() {
            this.ca.guide = function(g) {
                return {
                    guide: g
                };
            };
            this.ca.along = function(percent) {
                var g = this.attr("guide");
                var len = g.getTotalLength();
                var point = g.getPointAtLength(percent * len);
                var t = {
                    transform: "t" + point.x + "," + point.y
                };
                return t;
            };
        };
    })();

    width = screen.availWidth;
    height = screen.availHeight;

    var r = Raphael("game-field", width, height);
    r.addGuides();


    var field = new Field(r, 8);
});

function Field(raphael, dimension)
{
    var squareSize = 50, circleR = 20;
    dimension = (dimension) ? dimension : 10;
    var height = squareSize * dimension;
    this.cells = new Array(dimension);
    this.balls = new Array();
    var initBalls = 7, addBalls = 3,
        colors = new Array("#FF0000", "#0000FF", "#800080", "#008000", "#FFA500", "#FF00FF");

//    alert(generateColors(3));
    this.position = {
        left : (screen.availWidth - height) / 2,
        top : (screen.availHeight - height) / 2
    }

    var clearParent = function()
    {
        for(var i = 0; i < this.cells.length; i++) {
            for (var j = 0; j < this.cell.length; j++) {
                this.cells[i][j].parent = null;
            }
        }
    }
    gameField = this;
    var searchPath = function(current, destination)
    {
        var whiteList = new Array(), blackList = new Array();
        var startPoint = current, n = 0, maxN = dimension * dimension;
        blackList.push(current);
        gameField.cells[current.i][current.j].g = 0;

        while (current.i != destination.i || current.j != destination.j) {
            var checkArray = [
                {i:current.i - 1, j: current.j },
                {i:current.i + 1, j: current.j },
                {i: current.i, j: current.j + 1},
                {i: current.i, j: current.j - 1}
            ], min = Infinity, minPoint = null;

            for (i = 0; i < checkArray.length; i++) {
                if (gameField.cells[checkArray[i].i]
                    && gameField.cells[checkArray[i].i][checkArray[i].j]
                    && !gameField.cells[checkArray[i].i][checkArray[i].j].ball
                    && findObjectInArray({i: checkArray[i].i, j:checkArray[i].j}, blackList) == -1) {
                    if(findObjectInArray({i: checkArray[i].i, j:checkArray[i].j}, whiteList) == -1) {
                        whiteList.push(checkArray[i]);
                        gameField.cells[checkArray[i].i][checkArray[i].j].parent = current;
                        gameField.cells[checkArray[i].i][checkArray[i].j].g = 10;
                        gameField.cells[checkArray[i].i][checkArray[i].j].h = heuristic(checkArray[i]) * 10;
                        gameField.cells[checkArray[i].i][checkArray[i].j].f =
                            gameField.cells[checkArray[i].i][checkArray[i].j].g +
                            gameField.cells[checkArray[i].i][checkArray[i].j].h;
                    }

                    if (gameField.cells[checkArray[i].i][checkArray[i].j].f < min) {
                        min = gameField.cells[checkArray[i].i][checkArray[i].j].f;
                        minPoint = checkArray[i];
                    }
                }
                blackList.push(current);
            }
            if(!minPoint) {
                current = { i:gameField.cells[current.i][current.j].parent.i, j: gameField.cells[current.i][current.j].parent.j};
                continue;
            }
            current = minPoint;
            n ++;
            if (n == maxN) {
                return false;
            }
        }

        function heuristic(point){
            var result = Math.abs(point.i - destination.i) + Math.abs(point.j - destination.j);
            return result;
        }

        function getPath(point, begining)
        {
            var Path = new Array();

            var resultPath = " ";
            current = gameField.cells[point.i][point.j];
            while(current != gameField.cells[begining.i][begining.j]) {
                Path.unshift(current);
                resultPath = " l "
                    + (parseInt(current.attr('x')) - parseInt(gameField.cells[current.parent.i][current.parent.j].attr('x')))
                    + " "
                    + (parseInt(current.attr('y')) - parseInt(gameField.cells[current.parent.i][current.parent.j].attr('y')))
                    + resultPath;
                current = gameField.cells[current.parent.i][current.parent.j];

            }
            resultPath = "M 0 0 "
//                + (parseInt(current.ball.attr('cx')) + squareSize / 2)
//                + " "
//                + (parseInt(current.ball.attr('cy')) + squareSize / 2)
                + resultPath;
            return new Array(
                raphael.path(resultPath).attr({'stroke-width':'0px'}),
                gameField.cells[point.i][point.j]
            );

        }
        return getPath(current, startPoint);
    }
//  create cells block
    for (var i = 0; i < dimension; i++) {
        this.cells[i] = new Array(dimension);
        for (var j = 0; j < dimension; j++) {
            this.cells[i][j] = raphael.rect(
                this.position.left + j * squareSize,
                this.position.top + i * squareSize,
                squareSize,
                squareSize
            );
            this.cells[i][j].attr({fill: "#FFF5EE", stroke: "#000", strokeWidth: "2px" });
            this.cells[i][j].i = i;
            this.cells[i][j].j = j;
            gameField = this;
            this.cells[i][j].click(function(e){
                var checkBalls = new Array();
                var timeInterval = 2000;
                if (gameField.balls.animation) {
                    var Path = searchPath(
                        {i: gameField.balls.object.cell.i, j: gameField.balls.object.cell.j},
                        {i: this.i, j: this.j}
                    );
                    //alert(Path);
                    var j = 0;
                    //alert(Path);
//                    alert(gameField.balls.object.attr('transform'));
                    if (Path) {
                        gameField.balls.object.attr({guide: Path[0], along: 0}).animate({along: 1}, timeInterval, 'linear',
                        function(){
                            this.attr({'transform': ""});
                            this.attr({cx: parseInt(Path[1].attr('x')) + squareSize / 2, cy: parseInt(Path[1].attr('y')) + squareSize/2});
                        });

                        clearInterval(gameField.balls.animation);

                        this.ball = gameField.balls.object;
                        gameField.balls.object.cell.ball = null;
                        gameField.balls.object.cell = this;
                        gameField.balls.animation = false;
                        checkBalls.push(gameField.balls.object);
                        gameField.balls.object = null;

                        setTimeout(function(){gameField.createBalls(3)}, timeInterval);

                        gameField.removeBalls(checkBalls);
                    }
                }
            });
        }
    }

    this.createBalls = function (n) {
        var k, n, empty;
        var bollsColors = generateColors(n);
        for (var i = 0; i < bollsColors.length; i++) {
            empty = false;
            while (!empty) {
                k = Random(dimension - 1);
                n = Random(dimension - 1);
                if (!this.cells[k][n].ball) {
                    empty = true;
                }
            }
            this.cells[k][n].ball = raphael.circle(
                this.cells[k][n].attr('x') + squareSize / 2,
                this.cells[k][n].attr('y') + squareSize / 2,
                circleR
            );
            this.cells[k][n].ball.cell = this.cells[k][n];
            this.balls.push(this.cells[k][n].ball);
            this.cells[k][n].ball.attr({
                r: circleR,
                fill: bollsColors[i],
                strokeWidth: "1px"
            });
            this.cells[k][n].ball.animation = false;
            var gameField = this
            this.cells[k][n].ball.click(function(e){
                if (!gameField.balls.animation) {
                    var $this = this;
                    gameField.balls.animation = setInterval(function(){
                        var y = $this.attr("cy");
                        $this.animate({cy: y + 5},70,"linear", function(){
                            $this.animate({cy: y}, 70, "linear");
                        })
                    },200)
                    gameField.balls.object = this;
                } else {
                    clearInterval(gameField.balls.animation);
                    gameField.balls.animation = false;
                }
                e.stopPropagation();
            });
        }
    }

//  create start balls block
    this.createBalls(initBalls);

    function generateColors(number)
    {
        var result = new Array();
        for (var i = 0; i < number; i++) {
            result.push(colors[Random(colors.length - 1)]);
        }
        return result;
    }

    function Random(max)
    {
        return Math.ceil((Math.random() * 100) % max);
    }

    this.removeBalls = function (balls) {
        var resultBalls = [];
        for (var i = 0; i < balls.length; i++)
        {
            var checkItems = [
                {i: balls[i].cell.i + 1, j: balls[i].cell.j},
                {i: balls[i].cell.i + 1, j: balls[i].cell.j + 1},
                {i: balls[i].cell.i, j: balls[i].cell.j + 1},
                {i: balls[i].cell.i - 1, j: balls[i].cell.j},
                {i: balls[i].cell.i - 1, j: balls[i].cell.j - 1},
                {i: balls[i].cell.i, j: balls[i].cell.j - 1}
                ],
                color = balls[i].attr('fill');


            for (var j = 0; j < checkItems.length; j++ ) {
                var num = checkItems[j];

                if (this.cells[num.i] && this.cells[num.i][num.j] && this.cells[num.i][num.j].ball.attr('fill') == color) {
                    resultBalls.push(balls[i]);
                }
            }

        }
    }

}

function findObjectInArray(object, array){
    for(i = 0; i < array.length; i++) {
        if (JSON.stringify(object) === JSON.stringify(array[i])) {
            return i;
        }
    }
    return -1;
}


