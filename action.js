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

    const issueIds = typeof issues === 'string' ? issues.split(',') : [];
    for (const issueId of issueIds) {
      const resp = await this.Jira.getIssue(issueId);
      console.log(resp);
      console.log(resp.fields);
      console.log(resp.fields.comment);
      console.log(resp.fields.comment.comments);
      console.log(JSON.stringify(resp.fields.comment.comments));

      if (resp.fields.comment.comments.find((commentObj) => commentObj.body === comment) !== undefined) {
        console.log(`Comment already exists on issue: ${issueId}`);
        return {};
      }

      console.log(`Adding comment to ${issueId}: \n${comment}`);
      await this.Jira.addComment(issueId, { body: comment });
    }

    return {};
  }
};
