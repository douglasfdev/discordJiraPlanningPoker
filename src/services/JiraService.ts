// src/bot/services/jiraService.ts
import axios from 'axios';
import { IJiraIssue } from '../interfaces/IJiraIssue';

const JIRA_API_BASE_URL = 'rest/api/latest/issue/';

export class JiraService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders(): { headers: { Authorization: string } } {
    return {
      headers: {
        Authorization: `Basic ${Buffer.from(`api_token:${this.apiKey}`).toString('base64')}`,
      },
    };
  }

  async createIssue(summary: string, description: string, assignee: string): Promise<IJiraIssue> {
    try {
      const response = await axios.post(
        `${JIRA_API_BASE_URL}/issue`,
        {
          fields: {
            project: {
              key: 'YOUR_PROJECT_KEY', // Replace with your Jira project key
            },
            summary,
            description,
            assignee: {
              name: assignee,
            },
            issuetype: {
              name: 'Task', // Replace with the appropriate issue type
            },
          },
        },
        this.getHeaders()
      );

      const { key, fields } = response.data;
      return {
        key,
        summary: fields.summary,
        description: fields.description,
        status: fields.status.name,
        assignee: fields.assignee.name,
      };
    } catch (error) {
      console.error('Error creating issue: ', error);
      throw error;
    }
  }

  async getIssueByKey(issueKey: string): Promise<IJiraIssue | null> {
    try {
      const response = await axios.get(`${JIRA_API_BASE_URL}/issue/${issueKey}`, this.getHeaders());

      const { key, fields } = response.data;
      return {
        key,
        summary: fields.summary,
        description: fields.description,
        status: fields.status.name,
        assignee: fields.assignee.name,
      };
    } catch (error: any | unknown) {
      if (error.response && error.response.status === 404) {
        return null;
      }

      console.error('Error fetching issue: ', error);
      throw error;
    }
  }
}
