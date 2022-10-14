#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import  _Gitlab  from './modules/gitlab.js'
import report from './modules/excel.js'



yargs(hideBin(process.argv))
    .command('list', 'fetch all of the projects by current user', () => { }, async () => {
        console.info(await _Gitlab.getAllUserProjects())
        report(await _Gitlab.getAllUserProjects())
    })
    .command('overview <id>', 'get overview of specific project', () => { }, async (argv) => {
        console.info(await _Gitlab.getProjectOverview(argv.id))
        report(await _Gitlab.getProjectOverview(argv.id))
    })
    .command('milestone <id> [milestone]', 'get overview of specific project milestone', () => { }, async (argv) => {
        if (argv.milestone) console.info(await getMilestoneOverview(argv.id, argv.milestone))
        console.info(await getProjectMilestones(argv.id))
    })
    .command('MR <id> [MR]', 'get merge requests for specific project', () => { }, async (argv) => {
        if (argv.milestone) console.info(await getProjectOverview(argv.id, argv.mergeRequests))
        console.info(await getMergeRequests(argv.id))
    })
    .command('MRO <id> [MRO]', 'get overview of specific MR', () => { }, async (argv) => {
        if (argv.mergeRequests) console.info(await getMergeRequests(argv.id, argv.mergeRequests))
        console.info(await getMergeRequestOverview(argv.id))
    })
    .command('notes <id> [MRC]', 'get note count for MR', () => { }, async (argv) => {
        if (argv) console.info(await getProjectIssueNotes(argv.id, argv))
        console.info(await (argv.id))
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .strictCommands()
    .parse()