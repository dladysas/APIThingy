#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import  _Gitlab  from './modules/gitlab.js'
import report from './modules/excel.js'

//define file path for CSV file. script.js -i filename.csv script.js -i ../anotherfolder/filename.csv
//entry -> load config -> fetch file into array -> loop through array -> fetch data from gitlab -> write to excel
//Function to get JIRA reference
//Function to sort through projects/issues/merge requests
//Function to compare JIRA and Gitlab data
//parse statistics CSV file into array
//write to excel



yargs(hideBin(process.argv))
    //create entry point to CSV file
    //then parse the CSV file
    .command('list', 'fetch all of the projects by current user', () => { }, async () => {
        console.info(await _Gitlab.getAllUserProjects())
        report(await _Gitlab.getAllUserProjects())
    })
    //overview + Project ID
    .command('overview <id>', 'get overview of specific project', () => { }, async (argv) => {
        console.info(await _Gitlab.getProjectOverview(argv.id))
        report(await _Gitlab.getProjectOverview(argv.id))
    })
    //MR + Project ID
    .command('MR <id> [MR]', 'get merge requests for specific project', () => { }, async (argv) => {
        if (argv.mergeRequests) console.info(await _Gitlab.getProjectOverview(argv.id, argv.mergeRequests))
        console.info(await _Gitlab.getMergeRequests(argv.id))
        report(await _Gitlab.getMergeRequests(argv.id))
    })
    //MR ID + Project ID
    .command('MRO <id> ', 'get overview of specific merge request', () => { }, async (argv) => {
        if (argv.mergeRequestsOverview) console.info(await _Gitlab.getMergeRequests(argv.id, argv.mergeRequestsOverview))
        console.info(await _Gitlab.getMergeRequestOverview(argv.id))
        report(await _Gitlab.getMergeRequests(argv.id))
    })
    //Issues + Project ID
    .command('issues <id> [issues]', 'get issues for specific project', () => { }, async (argv) => {
        if (argv.issues) console.info(await _Gitlab.getProjectOverview(argv.id, argv.issues))
        console.info(await _Gitlab.getProjectIssues(argv.id))
        report(await _Gitlab.getProjectIssues(argv.id))
    })
    //get overview of a specific issue
    .command('statistics <id> ', 'get overview of specific issue', () => { }, async (argv) => {
        if (argv.issue) console.info(await _Gitlab.getIssuesStatistics(argv.issue))
        console.info(await _Gitlab.getIssuesStatistics(argv.id))
        report [(await _Gitlab.getIssuesStatistics(argv.id))]
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .strictCommands()
    .parse()