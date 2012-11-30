/**
 * Created with JetBrains PhpStorm.
 * User: Dasha
 * Date: 28.11.12
 * Time: 20:06
 * To change this template use File | Settings | File Templates.
 */

 var list =  new Array(4,5,7,8,9,5,1,3);
var i = 0, j = 1;
window.onload = function () {
    document.body.innerHTML += list.toString() + "<br>";

    while (list.length > 1) {

        if (j == 3) {
            list.splice(i, 1);
            document.body.innerHTML += list.toString() + "<br>";
            j = 1;
        } else {
            if (i == list.length-1) {
                i = 0;
            } else {
                i++;
            }
            j++;
        }
        if (i == list.length)
        i = 0;
    }
    var str = "486y5";
    var subStrings = getSubstrings(str);
    document.body.innerHTML += subStrings + "<br>" + subStrings.length + " " + str.length;
}


function getSubstrings(str) {
    var result = new Array(), n = str.length;
    for (var i = 1; i <= n; i++ ) {
        for (var j = 0; j <= n - i ; j++) {
            result.push(str.substr(j, i));
        }
    }
    return result;
}
