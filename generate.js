/*
	Problem description:
	Generate formatted HTML output for all passed data
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

//create document headers
const headerStr = '<!DOCTYPE html>\n<head>\n<meta charset="utf-8">\n<title>Repo report</title>\n</head>\n<body>';
fs.writeFileSync("report.html",headerStr,"utf-8");

let repos = fs.readFileSync("./repos.csv","UTF-8").split("\n")
repos = repos.splice(1,repos.length-1);
repos.forEach(function(elt,i){
	let a = elt.length-1;
	if(elt.split("")[a] === "\r") repos[i] = elt.split("").splice(0,a).join("").split(",");
	else repos[i] = elt.split(",");
	let repoIndex = repos[i][1].lastIndexOf("/") + 1;
	let b = repos[i][1].length - 1;
	repos[i][1] = repos[i][1].split("").splice(repoIndex,b).join("");
});

requestData();

function requestData(){
	if(repos.length === 0) return;
	let repoData = repos.pop();
	const owner = repoData[0];
	const repo = repoData[1];
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
	
	const ref = new Promise(function(s,f){
		let path1 = path + "/contributors" + queryString;
		let writable = "";
		options.path = path1;
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
	.then(function(){
		new Promise(function(s,f){
			let path2 = path + "/commits" + queryString;
			let writable = "";
			options.path = path2;
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
		.then(function(){
			new Promise(function(s,f){ 
				let path3 = path + "/issues" + queryString;
				let writable = "";
				options.path = path3;
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
		})
	});
	
	function generateReport(){
		let html = "";
		const contributors = JSON.parse(fs.readFileSync("contrib.json","utf-8"));
		const issues = JSON.parse(fs.readFileSync("issues.json","utf-8"));
		const commits = JSON.parse(fs.readFileSync("commits.json","utf-8"));
		html += "<h1>" + owner + "/" + repo + "</h1>\n";
		//contributor table
		html += "<table>\n<caption>contributors</caption><tr>\n<th>login</th><th>contributions</th>\n</tr>";
		contributors.forEach(function(contrib){
			html += (
				"<tr>\n<td>" + contrib.login + "</td>\n" 
				+ "<td>" + contrib.contributions + "</td>\n" 
				+ "</tr>\n"
			);
		});
		html += "<table>\n<caption>issues</caption><tr>\n<th>title</th><th>body</th><th>login</th></tr>";
		issues.forEach(function(issue){
			html += (
				"<tr>\n<td>" + issue.title + "</td>\n" 
				+ "<td>" + issue.body + "</td>\n" 
				+ "<td>" + issue.user.login + "</td>\n" 
				+ "</tr>\n"
			);
		});
		html += "<table>\n<caption>commits</caption><tr>\n<th>author</th><th>date</th><th>message</th>\n</tr>";
		commits.forEach(function(commit){
			html += (
				"<tr>\n<td>" + commit.commit.author.name + "</td>\n" 
				+ "<td>" + commit.commit.author.date + "</td>\n" 
				+ "<td>" + commit.commit.message + "</td>\n" 				
			);
		});
		html += "</table>";
		fs.appendFileSync("report.html",html,"utf-8");
		clearFiles();
		requestData();
	}
}

function clearFiles(){
	fs.unlinkSync("commits.json");
	fs.unlinkSync("contrib.json");
	fs.unlinkSync("issues.json");
}

// adds stylesheet info
let css = (
	"<style>\n"
	+"table {\n"
	+	"border-collapse: separate;\n"
	+	"border-spacing: 0;\n"
	+	"min-width: 350px;\n"
	+"}\n"
	+"table tr th,\n"
	+"table tr td {\n"
	+"	border-right: 1px solid #bbb;\n"
	+"	border-bottom: 1px solid #bbb;\n"
	+"	padding: 5px;\n"
	+"}\n"
	+"table tr th:first-child,\n"
	+"table tr td:first-child {\n"
	+"	border-left: 1px solid #bbb;\n"
	+"}\n"
	+"table tr th,\n"
	+"table tr:first-child td\n"
	+"{\n"
	+"	border-top: 1px solid #bbb;\n"
	+"}\n"
	+"table tr:first-child th:first-child {\n"
	+"	border-top-left-radius: 15px;\n"
	+"}\n"
	+"table tr:first-child th:last-child {\n"
	+"	border-top-right-radius: 15px;\n"
	+"}\n"
	+"table tr:last-child td:first-child {\n"
	+"	border-bottom-left-radius: 15px;\n"
	+"}\n"
	+"table tr:last-child td:last-child {\n"
	+"	border-bottom-right-radius: 15px;\n"
	+"}\n"
	+"th{\n"
	+"	vertical-align:middle;\n"
	+"	color:#fff;\n"
	+"	font-family:'Handlee';\n"
	+"	font-size:20px;\n"
	+"	background:linear-gradient(to right,#384da0,#5b689b)\n"
	+"}\n"
	+"tr td:nth-child(2){\n"
	+"	text-align:center;\n"
	+"}\n"
	+"caption {\n"
	+"	font-size:40px;\n"
	+"	margin:15px\n"
	+"}\n"
	+"</style>"
);

fs.appendFileSync("report.html",css,"utf-8");