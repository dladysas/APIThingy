// import JiraApi from 'jira-client';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import { AgileClient } from 'jira.js';
import * as dotenv from 'dotenv';
dotenv.config();

const host = process.env.JIRA_HOST;
const email = process.env.JIRA_EMAIL;
const token = process.env.JIRA_TOKEN;

const client = new AgileClient({
  host: 'https://donataspagan.atlassian.net',
  authentication: {
    basic: {
      email: 'ladysas.donatas@gmail.com',
      apiToken: 'KY6NqcLmflBwsHnmJzeoA229',
    },
  },
});


async function getAllProjects() {
  const projects = await client.project.getAllProjects();
  return {
    projects: projects.values.map((project) => ({
      id: project.id,
      name: project.name,
    })),
  };
}

async function getAllBoards() {
  const boards = await client.board.getAllBoards();
  return {
    boards: boards.values.map((board) => ({
      id: board.id,
      name: board.name,
      type: board.type,
    })),
  }
}
// const jira = new JiraApi({
//     protocol: 'https',
//     host: 'donataspagan.atlassian.net',
//     username: 'ladysas.donatas@gmail.com',
//     password: 'l2Um5Rr3hv8qy8dJGfZUAC50',
//     apiVersion: '2',
//     strictSSL: true
//   });

// async function listProjects() {
//   const projects = await jira.listProjects({})
//   let repos = []
//   projects.forEach(project => {
//     const _project = {
//       id: project.id,
//       key: project.key,
//       name: project.name,
//     }
//     repos.push(_project)
//   }); 
//   return repos
// }

export default {
  client,
  getAllBoards
}


// yargs(hideBin(process.argv))
//   .command('list', 'fetch all projects', () => {}, async () => {
//     console.info(await getAllBoards())
//   })
//   .demandCommand(1, 'You need at least one command before moving on')
//   .strictCommands()
//   .parse()