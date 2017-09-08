/*
	Problem description:
	Generate formatted HTML output for all passed data
	
	Todo:
	-Load ClientID/ClientSecret in JSON file. Gitignore the file.
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

let repos = fs.readFileSync("./repos.csv","UTF-8").split("\n").splice(1,2);
repos.forEach(function(elt,i){
	let a = elt.length-1;
	repos[i] = elt.split("").splice(0,a).join("").split(",");
	let repoIndex = repos[i][1].lastIndexOf("/") + 1;
	let b = repos[i][1].length - 1;
	repos[i][1] = repos[i][1].split("").splice(repoIndex,b).join("");
});

//create document headers
const headerStr = '<!DOCTYPE html>\n<head>\n<meta charset="utf-8">\n<title>Repo report</title>\n</head>\n<body>';
fs.writeFileSync("report.html",headerStr,"utf-8");

repos.forEach(function(repo){
	const owner = repo[0];
	const name = repo[1];
	requestData(owner,name);
});

//create document tab closers

//create stylesheet

function requestData(owner,repo){
	let path = "/repos/"+ owner + "/" + repo;
	const clientId = "";
	const clientSecret = "";
	const queryString = "?client_id=" + clientId + "&client_secret=" + clientSecret;
	const options = {
		hostname: api,
		method: "GET",
		path: path,
		headers: {
			"User-Agent":"doxtu",
			"Accept": "application/vnd.github.v3+json"
		}
	};
	
	new Promise(function(s,f){
		let path1 = path + "/contributors" + queryString;
		let writable = "";
		const req = https.request(options,(res)=>{
			res.on("data",(d)=>{
				writable += String(d);
			});
			res.on("end",()=>{
				fs.writeFileSync("contrib.json",writable,"utf-8");
				s();
			});
		});
		
		req.on("error",(e)=>{
			console.log(e);
			f();
		});
		req.end();
	})
	.then(
		new Promise(function(s,f){
			let path2 = path + "/commits" + queryString;
			let writable = "";
			fs.writeFileSync("commits.json","","utf-8");
			const req = https.request(options,(res)=>{
				res.on("data",(d)=>{
					writable += String(d);
				});
				res.on("end",()=>{
					fs.writeFileSync("commits.json",writable,"utf-8");
					s();
				});
			});
			
			req.on("error",(e)=>{
				console.log(e);
				f();
			});		
			
			req.end();
		})
		.then(
			new Promise(function(s,f){ 
				let path3 = path + "/issues" + queryString;
				let writable = "";
				fs.writeFileSync("issues.json","","utf-8");
				const req = https.request(options,(res)=>{
					res.on("data",(d)=>{
						writable += String(d);
					});
					res.on("end",()=>{
						fs.writeFileSync("issues.json",writable,"utf-8");
						s();
					});
				});
				
				req.on("error",(e)=>{
					console.log(e);
					f();
				});		
				req.end();
			})
			.then(generateReport)
		)
	);
	
	function generateReport(){
		var html = "";
		const contrib = JSON.parse(fs.readFileSync("contrib.json","utf-8"));
		try{
			html += "<h1>" + owner + "/" + repo + "</h1>\n";
			html += "<table>\n<caption>contributors</caption><tr>\n<th>login</th><th>contributions</th>\n</tr>";
			html += "<tr>\n<td>" + contrib.login + "</td>\n<td>" + contrib.contributions + "</td>";
			html += "</table>";
		}catch(e){
			console.log("error");
		}
		fs.appendFileSync("report.html",html,"utf-8");
	}
}

function clearFiles(){
	// fs.unlinkSync("commits.json");
	// fs.unlinkSync("contrib.json");
	// fs.unlinkSync("issues.json");
}