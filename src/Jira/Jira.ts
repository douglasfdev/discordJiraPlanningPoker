import axios from 'axios';
import { IJira } from '../interfaces';
import { jiraConfig } from '../config';

class Jira {
    private readonly baseUrl: string;
    private readonly username: string;
    private readonly apiKey: string;
    private readonly restUrl: string = '/rest/api/3';

    constructor({ baseUrl, username, apiKey }: IJira) {
        this.baseUrl = baseUrl;
        this.username = username;
        this.apiKey = apiKey;
        this.restUrl;
    }

    public async getUser(): Promise<any> {
        try {
            const config = {
                method: 'get',
                url: `${this.baseUrl}/${this.restUrl}/users`,
                headers: { 'Content-Type': 'application/json' },
                auth: { username: this.username, password: this.apiKey }
            }

            const { data } = await axios.request(config);
            return data;
        } catch (er: any | unknown) {
            console.error(er.response.data.errors);
        }
    }

    public async getIssues(id: string): Promise<any> {
        try {
            const config = {
                method: 'get',
                url: `${this.baseUrl}/${this.restUrl}/issue/${id}`,
                headers: {
                    'Authorization': `Basic ${Buffer.from(
                        `${jiraConfig.user}:${jiraConfig.token}`
                        ).toString('base64')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }

            const { data } = await axios.request(config);

            return {
                summary: data.fields.summary
            };
        } catch(er: any | unknown) {
            console.error(er.response);
        }
    }
}

const jira = new Jira({
    baseUrl: jiraConfig.domainURL,
    apiKey: jiraConfig.token,
    username: jiraConfig.user,
});

export { jira };
