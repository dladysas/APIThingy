import JiraApi from 'jira-client';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';

const jira = new JiraApi({
    protocol: 'https',
    host: 'donataspagan.atlassian.net',
    username: 'ladysas.donatas@gmail.com',
    password: 'l2Um5Rr3hv8qy8dJGfZUAC50',
    apiVersion: '2',
    strictSSL: true
  });

async function listProjects() {
  const projects = await jira.listProjects({})
  let repos = []
  projects.forEach(project => {
    const _project = {
      id: project.id,
      key: project.key,
      name: project.name,
    }
    repos.push(_project)
  }); 
  return repos
}

async function getProjectByKey(key) {
  const project = await jira.getProject(key)
  return {
    id: project.id,
    key: project.key,
    name: project.name,
    assigneeType: project.assigneeType,
    description: project.description,
  }
}

//create class get issues for a project
class Issues {
  constructor(key) {
    this.key = key
  }
  async getIssues() {
    const issues = await jira.searchJira(`project=${this.key}`)
    return issues.issues
  }
  async getOpenIssues() {
    const issues = await jira.searchJira(`project=${this.key} AND status != Closed`)
    return issues.issues
  }
  async getClosedIssues() {
    const issues = await jira.searchJira(`project=${this.key} AND status = Closed`)
    return issues.issues
  }
}

const issues = new Issues()

  
yargs(hideBin(process.argv))
  .command('list', 'fetch all projects', () => {}, async () => {
    console.info(await listProjects())
  })
  .command('overview <key>', 'fetch project overview', () => {}, async (argv) => {
    console.info(await getProjectByKey(argv.key, argv.listProjects))
  })
  .command('issues <key>', 'fetch all issues for a project', () => {}, async (argv) => {
    console.info(await issues.getIssues(argv.key, argv.listProjects))
  })  
  .demandCommand(1, 'You need at least one command before moving on')
  .strictCommands()
  .parse()