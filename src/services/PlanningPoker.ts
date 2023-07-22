import { JiraService } from './JiraService';

export class PlanningPokerService {
  private jiraService: JiraService;

  constructor(jiraService: JiraService) {
    this.jiraService = jiraService;
  }

  startPlanningPoker(issueKey: string, participants: string[]): void {
    '';
  }

  vote(issueKey: string, user: string, points: number): void {
    '';
  }

  endPlanningPoker(issueKey: string): void {
    '';
  }
}
