define(['lib/react', 'LoginPanel'], function(React, LoginPanel) {
  var JiraStatisticsCompilerPanel = React.createClass({
    render: function() {
      return React.DOM.div({className: "container"}, LoginPanel({login: this.login}));
    }
  });

  return JiraStatisticsCompilerPanel;
});
