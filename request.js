/*
	Given a user/repo combo, query the following information via the GitHub API:
	-Commit history
	-Issues
	-Contributors
	-Owner
	https://github.com/martinshkreli/shmusic
	https://github.com/MovingBlocks/Terasology
*/

const https = require("https");
const fs = require("fs");
const api = "api.github.com";

const types = [
	"commits",
	"issues",
	"pulls",
	"contributors"
];

// requestData("doxtu","personal-site","commits");

var ret = {
	requestData : requestData,
	types: types
};
function requestData(owner,repo,type){
	let path = "/repos/"+ owner + "/" + repo + "/" + type;
	fs.writeFileSync("data.json","","utf-8");
	
	const options = {
		hostname: api,
		method: "GET",
		path: path,
		headers: {
			"User-Agent":"doxtu",
			"Accept": "application/vnd.github.v3+json"
		}
	};

	const req = https.request(options, (res) => {
		res.on('data', (d) => {
			fs.appendFileSync("data.json",d,"utf-8");
		});
		res.on("end",()=>{
			return JSON.parse(fs.readFileSync("data.json","utf-8"));
		});
	});

	req.on('error', (e) => {
		console.error(e);
	});
	req.end();
}

module.exports = ret;