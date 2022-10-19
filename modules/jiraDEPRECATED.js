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

async function getBoardOverview(board_id) {
  const board = await client.board.getBoard({ boardId: board_id });
  return {
    id: board.id,
    name: board.name,
    type: board.type,
    columns: board.columns.map((column) => ({
      name: column.name,
      status: column.statuses.map((status) => ({
        name: status.name,
        id: status.id,
      })),
    })),
  }
}

export default {
  client,
  getAllBoards,
  getBoardOverview,
}
