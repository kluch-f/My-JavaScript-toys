/**
 * Created with JetBrains PhpStorm.
 * User: Dasha
 * Date: 06.12.12
 * Time: 23:01
 * To change this template use File | Settings | File Templates.
 */

$().ready(function(){
    width = screen.availWidth;
    height = screen.availHeight;

    var r = Raphael("game-field", width, height);

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
        var startPoint = current;
        blackList.push(current);
        gameField.cells[current.i][current.j].g = 0;

        while (current.i != destination.i || current.j != destination.j) {
                var checkArray = [
                    {i:current.i - 1, j: current.j },
                    {i:current.i + 1, j: current.j },
                    {i: current.i, j: current.j + 1},
                    {i: current.i, j: current.j - 1}
                ], min = Infinity, minPoint;

                for (i = 0; i < checkArray.length; i++) {
                    if (gameField.cells[checkArray[i].i] && gameField.cells[checkArray[i].i][checkArray[i].j] && !gameField.cells[checkArray[i].i][checkArray[i].j].ball) {
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
                }
                current = minPoint;
        }

        function heuristic(point){
            var result = Math.abs(point.i - destination.i) + Math.abs(point.j - destination.j);
            return result;
        }

        function getPath(point, begining)
        {
            var Path = new Array();
            current = gameField.cells[point.i][point.j];
            while(current != gameField.cells[begining.i][begining.j]) {
                Path.unshift(current);
                current = gameField.cells[current.parent.i][current.parent.j];
            }
            return Path;
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
                var timeInterval = 100;
                if (gameField.balls.animation) {
                    var Path = searchPath(
                        {i: gameField.balls.object.cell.i, j: gameField.balls.object.cell.j},
                        {i: this.i, j: this.j}
                    );
                    //alert(Path);
                    var j = 0;
                    var ballSliding = function() {
                        if(j < Path.length) {
                            elm = Path[j];
                            j++;
                            gameField.balls.object.animate({
                                cx: elm.attr('x') + squareSize / 2,
                                cy: elm.attr('y') + squareSize / 2
                            }, timeInterval,"linear", ballSliding);
                        }
                    }
                    ballSliding();

                    clearInterval(gameField.balls.animation);

                    this.ball = gameField.balls.object;
                    gameField.balls.object.cell.ball = null;
                    gameField.balls.object.cell = this;
                    gameField.balls.animation = false;
                    gameField.balls.object = null;
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

}

function findObjectInArray(object, array){
    for(i = 0; i < array.length; i++) {
        if (JSON.stringify(object) === JSON.stringify(array[i])) {
            return i;
        }
    }
    return -1;
}


