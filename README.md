GITHUB REPORT GENERATOR
========================

Task takes a .csv list of repositories and generates a report of commits, issues, and current contributors.

generate.js can be compiled with nexe to be ran as an application.

Problem statement
------------------

Given a list of github repos, perform the following steps:

Given a user/repo combo, pull data for the following (once as a GitHub API, and once with a web scraper):
 * Commit history
 * Issues
 * Contributors
 * Owner

Format the data into a easily readable report.

Make it a single button click with no dependencies (IE no nodejs).
