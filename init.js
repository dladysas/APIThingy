#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import  _Gitlab  from './modules/gitlab.js'
import report from './modules/excel.js'
import _Jira from './modules/jira.js'



yargs(hideBin(process.argv))
    .command('list', 'fetch all of the projects by current user', () => { }, async () => {
        console.info(await _Gitlab.getAllUserProjects(), await _Jira.getAllBoards())
        report(await _Gitlab.getAllUserProjects()) //await _Jira.getAllBoards())
    })
    .command('overview <id>', 'get overview of specific project', () => { }, async (argv) => {
        console.info(await _Gitlab.getProjectOverview(argv.id))
        report(await _Gitlab.getProjectOverview(argv.id))
    })
    .command('MR <id> [MR]', 'get merge requests for specific project', () => { }, async (argv) => {
        if (argv.mergeRequests) console.info(await _Gitlab.getProjectOverview(argv.id, argv.mergeRequests))
        console.info(await _Gitlab.getMergeRequests(argv.id))
        report(await _Gitlab.getMergeRequests(argv.id))
    })
    //get overview of a specific merge request
    .command('MRO <id> ', 'get overview of specific merge request', () => { }, async (argv) => {
        if (argv.mergeRequestsOverview) console.info(await _Gitlab.getMergeRequests(argv.id, argv.mergeRequestsOverview))
        console.info(await _Gitlab.getMergeRequestOverview(argv.id))
        report(await _Gitlab.getMergeRequests(argv.id))
    })
    .command('issues <id> [issues]', 'get issues for specific project', () => { }, async (argv) => {
        if (argv.issues) console.info(await _Gitlab.getProjectOverview(argv.id, argv.issues))
        console.info(await _Gitlab.getProjectIssues(argv.id))
        report(await _Gitlab.getProjectIssues(argv.id))
    })
    //get overview of a specific issue
    .command('statistics <id> ', 'get overview of specific issue', () => { }, async (argv) => {
        if (argv.issue) console.info(await _Gitlab.getIssuesStatistics(argv.isue))
        console.info(await _Gitlab.getIssuesStatistics(argv.id))
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .strictCommands()
    .parse()