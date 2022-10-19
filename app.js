//app.js
const http = require('http');
const url = require('url')
const pexpol1 = require("./pexpolicy");

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
    // policy service/configuration request
    var pathname = url.parse(req.url).pathname;
    var query = url.parse(req.url, true).query;
    console.log("Path" + pathname);

    // policy service/configuration request
    if (pathname === "/policy/v1/service/configuration" && req.method === "GET"){
        // Check there is query parms
        if (Object.keys(query).length === 0) {
            console.log("No request params, returning 400");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "No query params" }));
        }

        else {
            // process service/configuration policy request
            const pol_response = await new pexpol1().service_config(query)
            // set the status code, and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify(pol_response));
        }
    }
    // No route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});