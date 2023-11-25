import fetch from 'node-fetch';

const pexnodeapi = "https://sip.twofin.net/api/client/v2/conferences/"

// Obtain token
var thisurl = pexnodeapi + "class1/request_token"
var thisjson = {"display_name": "Classify Bot", "call_tag": "classify_bot"}
console.log(thisurl)
console.log(thisjson)

var response = await fetch(thisurl, {
    method: 'post',
	body: JSON.stringify(thisjson),
	headers: {'Content-Type': 'application/json'}
});
var data = await response.json();
console.log(data);
var thistoken = data.result.token;
console.log(thistoken)

// Get classification status
var thisurl = pexnodeapi + "class1/get_classification_level"
console.log(thisurl)

var response = await fetch(thisurl, {
	headers: {'token': thistoken}
});
var data = await response.json();
console.log(data);

// Change classification status
var thisurl = pexnodeapi + "class1/set_classification_level"
var thisjson = {"level": 3}
console.log(thisurl)
console.log(thisjson)

var response = await fetch(thisurl, {
    method: 'post',
	body: JSON.stringify(thisjson),
	headers: {'Content-Type': 'application/json', 'token': thistoken}
});
var data = await response.json();
console.log(data);

// Release Token
var thisurl = pexnodeapi + "class1/release_token"
console.log(thisurl)

var response = await fetch(thisurl, {
    method: 'post',
	headers: {'token': thistoken}
});
console.log(response.status)