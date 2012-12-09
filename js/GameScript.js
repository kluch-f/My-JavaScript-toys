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
            this.cells[i][j].click(function(e){
                alert(4);
                if (this.balls.animation) {

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
