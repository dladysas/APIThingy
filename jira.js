import JiraApi from 'jira-client';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';

const jira = new JiraApi({
    protocol: 'https',
    host: 'donataspagan.atlassian.net',
    username: 'ladysas.donatas@gmail.com',
    password: 'MgbBTFFrzOhyZBzk6LSLFC6E',
    apiVersion: '2',
    strictSSL: true
  });

async function listProjects() {
  const projects = await jira.listProjects({})
  let repos = []
  projects.forEach(project => {
    const _project = {
      name: project.name,
      id: project.Id
    }
    repos.push(_project)
  }); 
  return repos
}

// async function getComments(repo_id) {
//   const repo = await jira.getComments(repo_id)
//   const comments = await jira.Comments.all({ projectId: repo_id} )
//     return {
//       issueId: issue.length,
//       comments: comments.length, 
//     }
// }

yargs(hideBin(process.argv))
  .command('list', 'fetch all projects', () => {}, async () => {
    console.info(await listProjects())
  })
  .command('', '', () => {}, async () => {
    console.info()
  })
  .demandCommand(1)
  .parse()