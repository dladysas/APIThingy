import { AgileClient } from 'jira.js';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new AgileClient({
  host: process.env.JIRA_HOST,
  authentication: {
    basic: {
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_TOKEN,
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

export default {
  client,
  getAllBoards
}
