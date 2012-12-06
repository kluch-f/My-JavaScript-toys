/**
 * Created with JetBrains PhpStorm.
 * User: Dasha
 * Date: 01.12.12
 * Time: 23:24
 * To change this template use File | Settings | File Templates.
 */



window.onload = function () {
    document.getElementById('button').onclick = function () {
        var input = document.forms[0].text.value,
        blocks, maxLength, rows;

        blocks = input.split('\n');
        maxLength = blocks.shift().split(' ');
        rows = new Rows(parseInt(maxLength[0]));

        var j = 0;
        for (var i = 0; i < blocks.length; i++)
        {
            var arr = blocks[i].split(' ');
            var block = {
                width: parseInt(arr[0]),
                height: parseInt(arr[1])
            }
            if (!rows.canBeAdded(block, j)) {
                j++;
            }
            rows.addBlock(block, j);
        }

        document.getElementById('results').innerHTML = getResultString(rows);
    }

    function getResultString (rows) {
        var result = '';
        result += rows.getHeight() + ' ';
        result += rows.getLength() + '<br>';

        for (var i = 0; i < rows.getLength(); i++) {
            result += rows.getLineAt(i).length + '<br>';
        }
        return result;
    }
}

function Rows(maxLength){
    var max = maxLength;
    var lines = new Array();
    lines.height = 0;
    this.addBlock = function (block, rowNumber) {
        var oneLine = this.getLineAt(rowNumber);
        lines.height -= oneLine.height;
        oneLine.push(block);
        oneLine.lineLength += block.width;
        if (block.height > oneLine.height)
            oneLine.height = block.height;
        lines.height += oneLine.height;
    };

    this.removeLast = function (lineNumber) {
        lines.height -= lines[lineNumber].height;
        lines[lineNumber].length -= lines[lineNumber][lines[lineNumber].length - 1].width;
        var result = lines[lineNumber].pop();
        this.getLineHeight(lineNumber);
        lines.height += lines[lineNumber].height;
        return result;
    }

    this.canBeAdded = function (block, rowNumber) {
        var oneLine = this.getLineAt(rowNumber);
        if (oneLine.lineLength + block.width > max) {
            return false;
        }
        return true;
    }

    this.getAt = function (n, lineNumber) {
        return lines[lineNumber][n];
    }

    this.getLineHeight = function (lineNumber) {
        lines[lineNumber].height = 0;
        for (var i = 0; i < lines[lineNumber].length; i++) {
            if (lines[lineNumber].height < lines[lineNumber][i].height) {
                lines[lineNumber].height = lines[lineNumber][i].height;
            }
        }
        return lines[lineNumber].height;
    }

    this.getParagraphHeight = function () {
        lines.height = 0;
    }

    this.getLineAt = function (i) {
        if (!lines[i]) {
            lines[i] = new Array();
            lines[i].lineLength = 0;
            lines[i].height = 0;
        }
        return lines[i];
    }

    this.getHeight = function () {
        return lines.height;
    }

    this.getLength = function() {
     return lines.length;
    }
}
