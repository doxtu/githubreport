/*
	Problem description:
	Generate formatted HTML output for all passed data
*/

const request = require("./request.js");
const fs = require("fs");

let repos = fs.readFileSync("./repos.csv","UTF-8").split("\n").splice(1,2);
repos.forEach(function(elt,i){
	let a = elt.length-1;
	repos[i] = elt.split("").splice(0,a).join("").split(",");
	let repoIndex = repos[i][1].lastIndexOf("/") + 1;
	let b = repos[i][1].length - 1;
	repos[i][1] = repos[i][1].split("").splice(repoIndex,b).join("");
});

