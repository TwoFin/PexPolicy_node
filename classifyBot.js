//clasifyBot.js
import fetch from 'node-fetch';

const pexnodeapi = "https://sip.twofin.net/api/client/v2/conferences/"

export default class classifyBot {
    async setLevel(vmr, level) {
        // Set api base path for vmr
        const vmrurl = pexnodeapi + vmr + "/"

        // Obtain token
        var url = vmrurl + "request_token"
        var json = { "display_name": "Classify Bot", "call_tag": "classify_bot" }
        console.log("Requesting token from:", url)
        var response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(json),
            headers: { 'Content-Type': 'application/json' }
        });
        var data = await response.json();
        console.log(response.status);
        var thistoken = data.result.token;

        // Change classification status
        var url = vmrurl + "set_classification_level"
        var json = { "level": level }
        console.log("Requesting level change to", level, "from:", url)
        var response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(json),
            headers: { 'Content-Type': 'application/json', 'token': thistoken }
        });
        var data = await response.json();
        console.log(response.status);

        // Release Token to disocnnect Classify_bot
        var url = vmrurl + "release_token"
        console.log("Releasing token:", url)
        var response = await fetch(url, {
            method: 'post',
            headers: { 'token': thistoken }
        });
        console.log(response.status)

        // Return final status - will need error checking
        // return new Promise((resolve, _) => {
        //     resolve(response.status)
        // })
    }
}

// const levelSet = await new classifyBot().setLevel('class1', 4)