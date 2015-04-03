function StatisticsCalculator(issueArray) {
  this.issueArray = issueArray;
}

StatisticsCalculator.prototype.getPriorities = function() {
  var priorityMap = {};
  var issueMap = {};

  function initialiseMapKeyIfEmpty(key) {
    if (!issueMap[key]) {
      issueMap[key] = [];
    }
  }

  this.issueArray.forEach(function(issue) {
    var priorityKey = issue.fields.priority.id;
    var priorityName = issue.fields.priority.name;

    initialiseMapKeyIfEmpty(priorityKey);
    issueMap[priorityKey].push(issue);
    priorityMap[priorityKey] = priorityName;
  })

  return {issues: issueMap, priorityMap: priorityMap}
}
