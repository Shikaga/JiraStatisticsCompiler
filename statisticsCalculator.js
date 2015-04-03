function StatisticsCalculator(issueArray) {
  this.issueArray = issueArray;
}

function getStartDate(issue) {
  return parseDate(issue.fields.created);
}

function getResolutionDate(issue) {
  var finalState = null;
  var finalDate = null;
  issue.changelog.histories.forEach(function(history) {
    var dateOccured = parseDate(history.created);
    history.items.forEach(function(item) {
      if (item.field == "status" && item.toString == "Resolved") {
        finalState = item.toString;
        finalDate = dateOccured;
      }
    }.bind(this));
  });
  return finalDate;
}

function getTotalTimeInColumns(issue) {
  var columnChanges = getColumnChanges(issue);
  var columnMap = {};

  function initialiseColumnIfEmpty(key) {
    if (!columnMap[key]) {
      columnMap[key] = 0;
    }
  }

  columnChanges.forEach(function(change) {
    initialiseColumnIfEmpty(change.column);
    columnMap[change.column] += change.time;
  })

  return columnMap;

}

function getColumnChanges(issue) {
  var previousDate = getStartDate(issue);
  var transitionArray = [];
  var finalState = null;

  issue.changelog.histories.forEach(function(history) {
    var dateOccured = parseDate(history.created);
    history.items.forEach(function(item) {
      if (item.field == "status") {
        transitionArray.push({column: item.fromString, time: Math.round((dateOccured - previousDate) / 1000 / 60 / 60 / 24)})
        previousDate = dateOccured;
        finalState = item.toString;
      }
    }.bind(this));
  });

  transitionArray.push({column: finalState, time: Math.round((new Date() - previousDate) / 1000 / 60 / 60 / 24)})



  return transitionArray;
}

function getResolutionTime(issue) {
  var startDate = getStartDate(issue);
  var resolutionDate = getResolutionDate(issue);

  if (resolutionDate) {
    return Math.round((resolutionDate - startDate) / 1000 / 60 / 60 / 24);
  }
  return null;
}

StatisticsCalculator.prototype.getPriorities = function(optionalIssues) {
  var issues = optionalIssues ? optionalIssues : this.issueArray;
  var priorityMap = {};
  var issueMap = {};

  function initialiseMapKeyIfEmpty(key) {
    if (!issueMap[key]) {
      issueMap[key] = [];
    }
  }

  issues.forEach(function(issue) {
    var priorityKey = issue.fields.priority.id;
    var priorityName = issue.fields.priority.name;

    initialiseMapKeyIfEmpty(priorityKey);
    issueMap[priorityKey].push(issue);
    priorityMap[priorityKey] = priorityName;
  })

  return {issues: issueMap, priorityMap: priorityMap}
}

StatisticsCalculator.prototype.getComponents = function(optionalIssues) {
  var issues = optionalIssues ? optionalIssues : this.issueArray;
  var componentMap = {};

  function initialiseComponentIfEmpty(key) {
    if (!componentMap[key]) {
      componentMap[key] = [];
    }
  }

  issues.forEach(function(issue) {
    issue.fields.components.forEach(function(component) {
      initialiseComponentIfEmpty(component.name);
      componentMap[component.name].push(issue);
    })
  })

  return componentMap;
}

StatisticsCalculator.prototype.getResolution = function(optionalIssues) {
    var issues = optionalIssues ? optionalIssues : this.issueArray;
    var resolutionMap = {};

    function initialiseResolutionIfEmpty(key) {
      if (!resolutionMap[key]) {
        resolutionMap[key] = [];
      }
    }

    issues.forEach(function(issue) {
      var resolution = issue.fields.resolution ? issue.fields.resolution.name : "No Resolution"

      initialiseResolutionIfEmpty(resolution);
      resolutionMap[resolution].push(issue);
    })

    return resolutionMap;
}

StatisticsCalculator.prototype.getReporters = function(optionalIssues) {
    var issues = optionalIssues ? optionalIssues : this.issueArray;
    var reporterMap = {};

    function initialiseReporterIfEmpty(key) {
      if (!reporterMap[key]) {
        reporterMap[key] = [];
      }
    }

    issues.forEach(function(issue) {
      var reporter = issue.fields.reporter.displayName

      initialiseReporterIfEmpty(reporter);
      reporterMap[reporter].push(issue);
    })

    return reporterMap;
}

StatisticsCalculator.prototype.getResolutionTime = function(optionalIssues) {
    var issues = optionalIssues ? optionalIssues : this.issueArray;
    var resolutionMap = {};

    function initialiseResolutionIfEmpty(key) {
      if (!resolutionMap[key]) {
        resolutionMap[key] = [];
      }
    }


    issues.forEach(function(issue) {
      var resolutionTime = getResolutionTime(issue);

      initialiseResolutionIfEmpty(resolutionTime);
      resolutionMap[resolutionTime].push(issue);
    })

    return resolutionMap;
}

StatisticsCalculator.prototype.getColumnDuration = function(optionalIssues) {
    var issues = optionalIssues ? optionalIssues : this.issueArray;
    var issuesArray = [];

    issues.forEach(function(issue) {
      var totalTimeInColumns = getTotalTimeInColumns(issue);

      issuesArray.push({issue: issue, columnDuration: totalTimeInColumns})
    })

    return issuesArray;
}
