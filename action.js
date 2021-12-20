const Jira = require('./common/net/Jira');

module.exports = class {
  constructor({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    });

    this.config = config;
    this.argv = argv;
    this.githubEvent = githubEvent;
  }

  async execute() {
    const issues = this.argv.issue || this.config.issue || null;
    const { comment } = this.argv;

    const issueIds = issues?.split(',') || [];
    for (const issueId of issueIds) {
      console.log(`Adding comment to ${issueId}: \n${comment}`);
      await this.Jira.addComment(issueId, { body: comment });
    }

    return {};
  }
};
