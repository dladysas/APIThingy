#!/usr/bin/env node

import { Gitlab } from '@gitbeaker/node';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';


const GITLAB_TOKEN = process.env.GITLAB_TOKEN || 'glpat-QneyPoDctUzM-KDyDnK3';
const GITLAB_URL = process.env.GITLAB_URL || 'https://gitlab.com';

const api = new Gitlab({
    host: GITLAB_URL,
    token: GITLAB_TOKEN,
});

// async function getProjectByName(name) {
//     const projects = await api.Projects.all({ search: name });
//     return projects.find((project) => project.name === name);
// }

async function getAllUserProjects() {
    const projects = await api.Projects.all({ membership: true })
    let repos = []
    projects.forEach(project => {
        const _project = {
            name: project.name,
            id: project.id,
            url: project.web_url
        }
        repos.push(_project)
    })
    return repos
}

async function getProjectByName(name) {
    const repo = await api.Projects.all({ search: name })
    return repo.find((project) => project.name === name)
}

async function getProjectOverview(repo_id) {
    const repo = await api.Projects.show(repo_id)
    const issues = await api.Issues.all({ projectId: repo_id })
    return {
        name: repo.name,
        id: repo.id,
        url: repo.web_url,
        description: repo.description,
        visibility: repo.visibility,
        last_activity_at: repo.last_activity_at,
        issues: issues.length,
        open_issues: issues.filter(issue => issue.state === 'opened').length,
        closed_issues: issues.filter(issue => issue.state === 'closed').length,
        open_issues_percentage: Math.round((issues.filter(issue => issue.state === 'opened').length / issues.length) * 100),
        closed_issues_percentage: Math.round((issues.filter(issue => issue.state === 'closed').length / issues.length) * 100)
    }
}

async function getMergeRequests(repo_id) {
    let _merge_requests = []
    const merge_requests = await api.MergeRequests.all({ projectId: repo_id })
    merge_requests.forEach(merge_request => {
        _merge_requests.push({
            id: merge_request.id,
            title: merge_request.title,
            url: merge_request.web_url,
            state: merge_request.state,
            created_at: merge_request.created_at,
            updated_at: merge_request.updated_at,
            closed_at: merge_request.closed_at,
            merged_at: merge_request.merged_at,
        })
    })
    return _merge_requests
}

async function getMergeRequestOverview(repo_id, merge_request_id) {
    const merge_request = await api.MergeRequests.show(repo_id, merge_request_id)
    const commits = await api.MergeRequests.commits(repo_id, merge_request_id)
    const approvals = await api.MergeRequests.approvals(repo_id, merge_request_id)
    return {
        id: merge_request.id,
        title: merge_request.title,
        url: merge_request.web_url,
        state: merge_request.state,
        created_at: merge_request.created_at,
        updated_at: merge_request.updated_at,
        closed_at: merge_request.closed_at,
        merged_at: merge_request.merged_at,
        commits: commits.length,
        approvals: approvals.length,
        approvals_required: merge_request.approvals_required,
        approvals_left: merge_request.approvals_left,
        approvals_percentage: Math.round((approvals.length / merge_request.approvals_required) * 100)
    }
}

async function getProjectMilestones(repo_id) {
    let _milestones = []
    const milestones = await api.ProjectMilestones.show(repo_id)
    milestones.forEach(milestone => {
        _milestones.push({
            title: milestone.title,
            id: milestone.id,
            description: milestone.description,
            due_date: milestone.due_date,
            state: milestone.state,
            created_at: milestone.created_at,
            expired: milestone.expired
        })
    })
    return _milestones
}

async function getMilestoneOverview(repo_id, milestone_id) {
    const milestone = await api.ProjectMilestones.show(repo_id, milestone_id)
    const issues = (await api.Issues.all({ projectId: repo_id })).filter(issue => issue.milestone && issue.milestone.id === milestone_id)
    return {
        title: milestone.title,
        id: milestone.id,
        description: milestone.description,
        due_date: milestone.due_date,
        state: milestone.state,
        created_at: milestone.created_at,
        expired: milestone.expired,
        issues: issues.length,
        open_issues: issues.filter(issue => issue.state === 'opened').length,
        closed_issues: issues.filter(issue => issue.state === 'closed').length,
        open_issues_percentage: Math.round((issues.filter(issue => issue.state === 'opened').length / issues.length) * 100),
        closed_issues_percentage: Math.round((issues.filter(issue => issue.state === 'closed').length / issues.length) * 100)
    }
}


yargs(hideBin(process.argv))
    .command('list', 'fetch all of the projects by current user', () => { }, async () => {
        console.info(await getAllUserProjects())
    })
    .command('project <name>', 'fetch a project by a name input', () => { }, async (argv) =>{
        console.info(await getProjectByName(argv.name))
    })
    .command('overview <id>', 'get overview of specific project', () => { }, async (argv) => {
        console.info(await getProjectOverview(argv.id))
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
        if (argv) console.info(await (argv.id, argv))
        console.info(await (argv.id))
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .strictCommands()
    .parse()