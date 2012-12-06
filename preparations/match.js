/**
 * Created with JetBrains PhpStorm.
 * User: Dasha
 * Date: 02.12.12
 * Time: 21:25
 * To change this template use File | Settings | File Templates.
 */
 
 window.onload = function() {

	document.forms[0].go.onclick = function() {
		var number, result;
		number = parseInt(document.forms[0].amount.value);
		result = getResultNumber(number);
		
		document.getElementById('result').innerHTML = result;
	};
 }
 
 function getResultNumber(n) {
	var squareNumber,rest, matchNumber, result;
    matchNumber = n;
	squareNumber = Math.round(Math.sqrt(matchNumber));
	rest = matchNumber - squareNumber * squareNumber;
	if(squareNumber > 0) {
		result = 4 * 1 + (squareNumber - 1) * 2 * 3 + (Math.pow(squareNumber, 2) - (squareNumber - 1) * 2 - 1) * 2;
	} else {
		result = 4
	}

    result += (rest - ((rest > squareNumber)?2:1)) * 2 + 3;

	return result;
 }


