import fetch from 'node-fetch';

const level_map = {
    "0": "UNOFFICIAL",
    "1": "OFFICIAL",
    "2": "PROTECTED",
    "3": "SECRET",
    "4": "TOP SECRET"
}

const pexnodeapi = "https://sip.twofin.net/api/client/v2/conferences/" // TODO Externalise

export default class controlClass {
    async lowerClass(vmr, level) {
        // Set api base path for vmr
        const vmrurl = pexnodeapi + vmr + "/"

        // Obtain token
        var url = pexnodeapi + vmr + "/request_token"
        var json = { "display_name": "MeetBot", "call_tag": "secret123" }
        console.log(url)
        var response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(json),
            headers: { 'Content-Type': 'application/json' }
        });
        var data = await response.json();
        console.log(response.status);
        var thistoken = data.result.token;

        // Reverse look up new participant classification level from level_map
        var new_level = Number(Object.keys(level_map).find(e => level_map[e] == level))
        console.log("New participant security level is: ", level, "=", new_level);

        // Get current vmr classification level
        var url = pexnodeapi + vmr + "/get_classification_level"
        console.log(url)
        var response = await fetch(url, {
        	headers: {'token': thistoken}
        });
        var data = await response.json();
        var current_level = data.result.current
        console.log("Current security level is: ", current_level);

        // Lower clissifiction level if new participant has lower class
        if (new_level < current_level)
        {
            var url = pexnodeapi + vmr + "/set_classification_level"
            var json = { "level": new_level }
            console.log("Requesting level change to", json, "from:", url)
            var response = await fetch(url, {
                method: 'post',
                body: JSON.stringify(json),
                headers: { 'Content-Type': 'application/json', 'token': thistoken }
            });
            var data = await response.json();
            console.log(response.status);    
        }
        else
        {
            console.log("No level chenge required as new participant has required clearance")
            new_level = current_level
        }

        // Release Token to disocnnect Classify_bot
        var url = vmrurl + "release_token";
        console.log(url)
        var response = await fetch(url, {
            method: 'post',
            headers: { 'token': thistoken }
        });
        console.log(response.status);

        //  Resulting level returned
        const result = level_map[new_level]
        console.log(result)        
        return new Promise((resolve, _) => resolve(result))
    }
}
