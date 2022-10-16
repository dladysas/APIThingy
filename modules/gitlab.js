import { Gitlab } from '@gitbeaker/node';
import * as dotenv from 'dotenv' 
dotenv.config()

const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITLAB_URL = process.env.GITLAB_URL;

const api = new Gitlab({
    host: GITLAB_URL,
    token: GITLAB_TOKEN,
});

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
    const merge_request = await api.MergeRequests.show(repo_id, merge_request_id)
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

// async function getProjectMilestones(repo_id) {
//     let _milestones = []
//     const milestones = await api.ProjectMilestones.show(repo_id)
//     milestones.forEach(milestone => {
//         _milestones.push({
//             title: milestone.title,
//             id: milestone.id,
//             description: milestone.description,
//             due_date: milestone.due_date,
//             state: milestone.state,
//             created_at: milestone.created_at,
//             expired: milestone.expired
//         })
//     })
//     return _milestones
// }

// async function getMilestoneOverview(repo_id, milestone_id) {
//     const milestone = await api.ProjectMilestones.show(repo_id, milestone_id)
//     const issues = (await api.Issues.all({ projectId: repo_id })).filter(issue => issue.milestone && issue.milestone.id === milestone_id)
//     return {
//         title: milestone.title,
//         id: milestone.id,
//         description: milestone.description,
//         due_date: milestone.due_date,
//         state: milestone.state,
//         created_at: milestone.created_at,
//         expired: milestone.expired,
//         issues: issues.length,
//         open_issues: issues.filter(issue => issue.state === 'opened').length,
//         closed_issues: issues.filter(issue => issue.state === 'closed').length,
//         open_issues_percentage: Math.round((issues.filter(issue => issue.state === 'opened').length / issues.length) * 100),
//         closed_issues_percentage: Math.round((issues.filter(issue => issue.state === 'closed').length / issues.length) * 100)
//     }
// }

//list project issue notes
async function getProjectIssueNotes(repo_id, issue_id) {
    let _notes = []
    const notes = await api.Issues.allNotes(repo_id, issue_id)
    notes.forEach(note => {
        _notes.push({
            id: note.id,
            body: note.body,
            created_at: note.created_at,
            updated_at: note.updated_at,
            system: note.system,
            
        })
    })
    return _notes
}

export default { 
    api,
    getAllUserProjects, 
    getProjectOverview, 
    getMergeRequests, 
    getMergeRequestOverview, 
    // getProjectMilestones, 
    // getMilestoneOverview, 
    getProjectIssueNotes, 
}