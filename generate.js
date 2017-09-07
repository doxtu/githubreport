/*
	Problem description:
	Generate formatted HTML output for all passed data
*/
const https = require("https");
const fs = require("fs");
const api = "api.github.com";
const fs = require("fs");
const types = [
	"commits",
	"issues",
	"pulls",
	"contributors"
];

let repos = fs.readFileSync("./repos.csv","UTF-8").split("\n").splice(1,2);
repos.forEach(function(elt,i){
	let a = elt.length-1;
	repos[i] = elt.split("").splice(0,a).join("").split(",");
	let repoIndex = repos[i][1].lastIndexOf("/") + 1;
	let b = repos[i][1].length - 1;
	repos[i][1] = repos[i][1].split("").splice(repoIndex,b).join("");
});

//create document headers
const headerStr = '<!DOCTYPE html>\n<head>\n<meta charset="utf-8">\n<title>Repo report</title>\n</head>\n';
fs.writeFileSync("report.html",headerStr,"utf-8");

repos.forEach(function(repo){
	const owner = repo[0];
	const name = repo[1];
	requestData(owner,name);
});

//create document tab closers

//create stylesheet

function requestData(owner,repo){
	let path = "/repos/"+ owner + "/" + repo + "/" + type;
	
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
			
		});
		res.on("end",generateReport);
	});

	req.on('error', (e) => {
		console.error(e);
	});
	req.end();
	
	function generateReport(){
		let html = "";
		html += "<h1>" + owner + "/" + repo + "</h1>\n";
		html += "<table>\n<caption>contributors</caption><tr>\n<th>login</th><th>contributions</th>\n</tr>";
		fs.appendFileSync("report.html",html,"utf-8");
	}
}