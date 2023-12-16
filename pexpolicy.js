// pexpolicy.js
// Process Pexip Infinity external policy requests

//import controlClass from pexClientAPI.js
import controlClass from "./pexClientAPI.js";

// default policy responses
const pol_reject = {
    "status": "success",
    "action": "reject"
}
const pol_reject_msg = {
    "status": "success",
    "action": "reject",
    "result" : {"reject_reason": "ACCESS DENIED"}
}
const pol_continue = {
    "status": "success",
    "action": "continue"
}

// Set lists for IDP processing - TODO externalize
const idpAttrs = ["department", "jobtitle", "givenname", "surname"]
const rankCo = ["Air Chief Marshal",
    "General",
    "Admiral",
    "Colonel",
    "Captain",
    "Squadron Leader",
    "Major",
    "Lieutenant"
]
const rankTop = ["Air Chief Marshal",
    "General",
    "Admiral"
]

export default class PexPolicy {
    // process service/configuration policy request 
    async service_config(query) {
        // Log query params
        console.log("Service query: ", query)

        // Copy responses in local scope
        const pol_response = Object.assign({}, pol_continue);
        const pol_response_reject = Object.assign({}, pol_reject);
        
        // Check if meeting bot to bypass IDP
        if (query.remote_alias === "MeetBot" && query.call_tag === "secret123" ){
            pol_response.result = {
                "name": query.local_alias,
                "service_tag": "allDept",
                "service_type": "conference",
                "host_identity_provider_group":""
            }
            console.log("SERV_POL: Meeting Bot - bypassing IDP", pol_response)
            return new Promise((resolve, _) => resolve(pol_response))
        }

        // Default response
        else{
            console.log("SERV_POL: No changes:", pol_response);
            return new Promise((resolve, _) => resolve(pol_response))
        }
    }

    // process participant/properties policy request 
    async participant_prop(query) {
        // Log query params
        console.log("Participant query: ", query)

        // Copy responses in local scope
        const pol_response = Object.assign({}, pol_continue);
        const pol_response_reject = Object.assign({}, pol_reject_msg);

        // Build overlay text from IDP attr - TODO Functionlize and reduce double handling
        if (query.idp_attribute_jobtitle && query.idp_attribute_surname && query.idp_attribute_department){
            pol_response.result = {"remote_display_name": query.idp_attribute_jobtitle + " " + query.idp_attribute_surname + " | " + query.idp_attribute_department}
            console.log("Display name updated: ", pol_response.result.remote_display_name)
        }
        else {
            console.log("Not enough IDP attributes to build overlay text name, default will be used")
        }
        
        // Extract parametes from service_tag
        const tag_params = query.service_tag.split("_")
        console.log("service_tag parmameters: ", tag_params)

        // All departments tag - continue based on VMR config - allows classification change based on idp_attribute_clearance
        if (tag_params[0] === "allDept") {
            // if (query.remote_alias === "MeetBot" && query.call_tag === "secret123" )
            // {
            //     console.log("Meeting Bot - bypassing classification check")
            // }
            // else
            // {
            //     const result = await new controlClass().lowerClass(query.service_name, query.idp_attribute_xlearance)
            //     console.log("VMR has classification", result)
            // }
            
            console.log("Participant policy done:", pol_response);
            return new Promise((resolve, _) => resolve(pol_response))
        }

        // Entry condition based on rank
        else if (tag_params[0] === "rank") {
            if (tag_params[1] === "co" && rankCo.includes(query.idp_attribute_jobtitle)) {
                // CO Memeber
                console.log("Participants idp jobtitle is on CO list OK")
                console.log("Participant policy done:", pol_response);
                return new Promise((resolve, _) => resolve(pol_response))
            }
            else if (tag_params[1] === "top" && rankTop.includes(query.idp_attribute_jobtitle)) {
                // Top Member
                console.log("Participants idp jobtitle is on TOP list OK")
                console.log("Participant policy done:", pol_response);
                return new Promise((resolve, _) => resolve(pol_response))
            }
            else {
                pol_response_reject.result.reject_reason = "ACCESS DENIED You do not have the required rank"
                console.log("Participants idp jobtitle NOT in any rank list")
                console.log("Participant policy done:", pol_response_reject);
                return new Promise((resolve, _) => resolve(pol_response_reject))
            }
        }

        // Entry condition based on idp attribute from idpAttr list
        else if (idpAttrs.includes(tag_params[0])) {
            // Extract idp attribute to check
            const idpCheckAttr = "idp_attribute_" + tag_params[0];

            // Admit participant if idp attribute matches 2nd tag parameter  
            if (query[idpCheckAttr] === tag_params[1]) {
                console.log("Participants idp attribute matches service_tag OK")
                console.log("Participant policy done:", pol_response);
                return new Promise((resolve, _) => resolve(pol_response))
            }

            // Reject if no match
            else {
                pol_response_reject.result.reject_reason = "ACCESS DENIED You are not in the " + tag_params[1]
                console.log("Participants idp attribute does NOT match service_tag")
                console.log("Participant policy done:", pol_response);
                return new Promise((resolve, _) => resolve(pol_response_reject))
            }
        }

        // Default response
        else {
            console.log("Participant policy done, default response:", pol_response);
            return new Promise((resolve, _) => resolve(pol_continue))
        }
    }
}
