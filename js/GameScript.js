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
    var squareSize = 35;
    dimension = (dimension) ? dimension : 10;
    var height = squareSize * dimension;
    this.cells = new Array(dimension);

    this.position = {
        left : (screen.availWidth - height) / 2,
        top : (screen.availHeight - height) / 2
    }
    

    for (var i = 0; i < dimension; i++) {
        this.cells[i] = new Array(dimension);
        for(var j = 0; j < dimension; j++) {
            this.cells[i][j] = raphael.rect(
                this.position.left + j * squareSize,
                this.position.top + i * squareSize,
                squareSize,
                squareSize
            );
            this.cells[i][j].attr({fill: "#FFF5EE", stroke: "#000", strokeWidth: "2px" })
        }

    }


}
