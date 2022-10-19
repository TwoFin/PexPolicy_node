// pexpolicy.js
// Process Pexip Infinity external policy requests

// default policy responses
const pol_reject = {
    "status" : "success",
    "action" : "reject"
    }
const pol_continue = {
    "status" : "success",
    "action" : "continue"
    }

class PexPolicy {
    // process service/configuration policy request 
    async service_config(query) {

        
        // else {
            const pol_response = Object.assign({}, pol_continue);
            pol_response.result = {"local_alias": query.local_alias}
            return new Promise((resolve, _) => resolve(pol_response))
        // }
    }
}
module.exports = PexPolicy;