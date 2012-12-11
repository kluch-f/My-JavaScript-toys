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


function has_conflicts(starts, ends) {
    for (var i = 0; i< starts.length; i++) {
        for(j = i+1; j < starts.length; j++) {
            if((starts[i] <= starts[j] && starts[j] <= ends[i]) || (starts[i] <= ends[j] && ends[j] <= ends[i])){
                return false;
            }

            if((starts[j] <= starts[i] && starts[i] <= ends[j]) || (starts[j] <= ends[i] && ends[i] <= ends[j])){
                return false;
            }
        }
    }
    return true;
}
starts = [1, 12, 5, 3, 8];
ends =   [2, 13, 6, 4, 9];
function has_conflicts1(starts, ends) {
    var newStarts = new Array(), newEnds = new Array();
    newStarts.push(starts[0]);
    newEnds.push(ends[0]);
    for (var i = 1; i < starts.length; i++) {
        if (starts[i] > newEnds[newEnds.length - 1]) {
            newStarts.push(starts[i]);
            newEnds.push(ends[i]);
            continue;
        }
        if (ends[i] < starts[0]) {
            newStarts.unshift(starts[i]);
            newEnds.unshift(ends[i]);
            continue;
        }
        for(var j = 0; j < newStarts.length; j++) {
            if (starts[i] >= newStarts[j] && starts[i] <= newEnds[j] || ends[i] >= newStarts[j] && ends[i] <= newEnds[j]) {
                return false;
            }
            if (newStarts[j] >= starts[i] && newStarts[j] <= ends[i] || newEnds[j] >= starts[i] && newEnds[j] <= ends[i]) {
                return false;
            }
            if (newStarts[j] > starts[i]) {
                newStarts.splice(j-1, 0, starts[i]);
                newEnds.splice(j-1, 0, ends[i]);
                break;
            }
        }
    }
    return true;
}

alert(has_conflicts(starts, ends));