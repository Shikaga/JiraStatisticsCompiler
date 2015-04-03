define(['lib/react', 'LoginPanel'], function(React, LoginPanel) {


  var AgileBoardStockTaker = React.createClass({
    getInitialState: function() {
      return {
        issueId: "",
        selectedIssueId: null,
        issuesChanged: [],
        mode: "login",
        projectData: null,
        issues: null
      }
    },
    doneClicked: function() {
      this.setState({
        selectedIssueId: this.state.issueId,
        issueId: ""
      });
    },
    completeClicked: function() {
      this.setState({
        mode: "changed"
      });
    },
    numberClicked: function(number) {
      this.setState({
        issueId: this.state.issueId + number
      })
    },
    issueChanged: function(data) {
      this.setState({
        issuesChanged: this.state.issuesChanged.concat(data)
      });
    },
    moreClicked: function() {
      this.setState({
        mode: "input"
      });
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
      // getDataWithJSON(function(data) {
      // 	var projects = [];
      // 	data.views.forEach(function(view) {
      // 		console.log(view.name, view.id, view.key, view);
      // 		projects.push({name: view.name, id: view.id, key: view.key})
      // 	});
      // 	this.setState({projectData: projects});
      // }.bind(this), username, password, url + "/rest/greenhopper/1.0/rapidviews/viewsData.json");
    },
    saveLoginDetails: function() {

    },
    selectProject: function(projectId) {
      getDataWithJSON(function(projectData) {
        console.log("data", projectData)
        var getOrderedIssues = function(x) {
          var issues = [];
          x.issues.forEach(function(issue) {
            var finalState = null;
            var finalDate = null;
            issue.changelog.histories.forEach(function(history) {
            var dateOccured = this.parseDate(history.created);
            history.items.forEach(function(item) {
              if (item.field == "status" && item.toString == "Resolved") {
                finalState = item.toString;
                finalDate = dateOccured;
              }
            }.bind(this));
          }.bind(this))
          issues.push({summary: issue.fields.summary, key: issue.key, createdDate: this.parseDate(issue.fields.created), resolvedDate: finalDate})
        }.bind(this))
          this.setState({issues: issues});
        }.bind(this)

        getOrderedIssues(projectData);

      }.bind(this), this.state.username, this.state.password, this.state.url + "/rest/api/latest/search?jql=project=" + window.location.search.substr(1) + " AND issuetype=Bug&maxResults=1000&expand=changelog");
    },
    render: function() {
      return React.DOM.div({className: "container"}, LoginPanel({login: this.login}));
    }
  });

  return AgileBoardStockTaker;
});
