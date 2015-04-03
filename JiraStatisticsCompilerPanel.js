define(['lib/react', 'LoginPanel'], function(React, LoginPanel) {
  var JiraStatisticsCompilerPanel = React.createClass({
    render: function() {
      return React.DOM.div({className: "container"}, LoginPanel({login: this.login}));
    },
    getInitialState: function() {
      return {
      }
    },
    selectProject: function(projectId) {
      getDataWithJSON(function() {}, this.state.username, this.state.password,
      this.state.url + "/rest/api/latest/search?jql=project=" + window.location.search.substr(1) + " AND issuetype=Bug&maxResults=1000&expand=changelog");
    },
    login: function(url, username, password) {
        window.url = url;
        this.state.url = url;
        this.state.username = username;
        this.state.password = password;
        this.setState({
          url: url,
          username: username,
          password: password,
          mode: "loggedIn"
        });
        this.selectProject(80);
      }
  });

  return JiraStatisticsCompilerPanel;
});
