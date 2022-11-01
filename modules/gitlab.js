import { Gitlab } from '@gitbeaker/node';
import * as dotenv from 'dotenv' 
dotenv.config()

const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITLAB_URL = process.env.GITLAB_URL;

const api = new Gitlab({
    host: GITLAB_URL,
    token: GITLAB_TOKEN,
});

//Function to sort through projects/issues/merge requests

async function getAllUserProjects() {
    const projects = await api.Projects.all({ membership: true })
    let repos = []
    projects.forEach(project => {
        const _project = {
            name: project.name,
            id: project.id,
        }
        repos.push(_project)
    })
    return repos
}

async function getProjectOverview(repo_id) {
    const repo = await api.Projects.show(repo_id)
    const issues = await api.Issues.all({ projectId: repo_id })
    return [{
        name: repo.name,
        id: repo.id,
        description: repo.description,
        visibility: repo.visibility,
        last_activity_at: repo.last_activity_at,
        issues: issues.length,
        open_issues: issues.filter(issue => issue.state === 'opened').length,
        closed_issues: issues.filter(issue => issue.state === 'closed').length,
        open_issues_percentage: Math.round((issues.filter(issue => issue.state === 'opened').length / issues.length) * 100),
        closed_issues_percentage: Math.round((issues.filter(issue => issue.state === 'closed').length / issues.length) * 100)
    }]
}

async function getMergeRequests(repo_id) {
    let _merge_requests = []
    const merge_requests = await api.MergeRequests.all({ projectId: repo_id })
    merge_requests.forEach(merge_request => {
        _merge_requests.push({
            id: merge_request.id,
            iid: merge_request.iid,
            title: merge_request.title,
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
    const merge_request = await api.MergeRequests.all(repo_id, merge_request_id)
    const commits = await api.MergeRequests.commits(repo_id, merge_request_id)
    const approvals = await api.MergeRequests.approvals(repo_id, merge_request_id)
    return {
        id: merge_request.id,
        iid: merge_request.iid,
        title: merge_request.title,
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

async function getProjectIssues(repo_id){
    let _issues = []
    const issues = await api.Issues.all({ projectId: repo_id })
    issues.forEach(issue => {
        _issues.push({
            id: issue.id,
            iid: issue.iid,
            title: issue.title,
            state: issue.state,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            closed_at: issue.closed_at,
            merged_by: issue.merged_by,
        })
    })
    return _issues
}

async function getIssuesStatistics(repo_id, issue_id) {
    const issue = await api.IssuesStatistics.all(repo_id, issue_id)
    return issue
    
}

export default { 
    api,
    getAllUserProjects, 
    getProjectOverview, 
    getMergeRequests, 
    getMergeRequestOverview, 
    getProjectIssues,
    getIssuesStatistics,
    sortData
}
