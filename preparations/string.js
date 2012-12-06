/**
 * Created with JetBrains PhpStorm.
 * User: Dasha
 * Date: 03.12.12
 * Time: 23:12
 * To change this template use File | Settings | File Templates.
 */


window.onload = function() {
    document.main.go.onclick = function() {
        var value, result;
        value = document.main.string.value;

        result = LargestPolindrom(value);

        document.getElementById('result').innerHTML = result;
    }
}

function LargestPolindrom(str)
{
    var sizes, result;
    sizes = new Array(str.length);
    for (var i = 0; i < str.length; i++) {
        sizes[i] = new Array(str.length);
    }

    for(i = 0; i < str.length; i++) {
        for (j = 0; j < str.length - i; j++) {

            if (i != 0) {
                var s = str.substr(j, i + 1);
                var currentValue = max(sizes[j][j + i - 1], sizes[j+1][j + i]);
                if (s.charAt(0) == s.charAt(s.length - 1)) {
                    currentValue += 2;
                }
                sizes[j][j + i] = currentValue;
            } else {
                sizes[j][j + i] = 1;
            }
        }

    }

    function max(a, b) {
        if (a > b) {
            return a;
        }
        return b;
    }

    result = sizes[0][str.length - 1];
    return result;
}


