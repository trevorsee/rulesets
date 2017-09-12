'use strict';

function newRuleSet() {
  return {
    options: {}
  };
};

function addOption(title, rs) {
  if (!rs.options[title]) {
    rs.options[title] = {
      isParentTo: [],
      isDependentOn: []
    };
  }
}

function addDependency(o, t, rs) {
  // check that option exists
  addOption(o, rs);
  // check that target-option exists
  addOption(t, rs);

  // add dependency if it doesn't already exist
  if (!rs.options[o].isDependentOn.includes(t)) {
    rs.options[o].isDependentOn.push(t);
  }
  // check all options associated, add dependency
  for (var i = 0; i < rs.options[o].isParentTo.length; i++) {
    var current = rs.options[o].isParentTo[i];
    if (!rs.options[current].isDependentOn.includes(t)) {
      rs.options[current].isDependentOn.push(t);
    }
  }
  // add parent-role to target-option
  if (!rs.options[t].isParentTo.includes(o)) {
    rs.options[t].isParentTo.push(o);
  }
  // check for other necessary parent-roles
  for (var _i = 0; _i < rs.options[o].isParentTo.length; _i++) {
    var _current = rs.options[o].isParentTo[_i];
    if (!rs.options[t].isParentTo.includes(_current)) {
      rs.options[t].isParentTo.push(_current);
    }
  }
}

function addConflict(o, t, rs) {}

function checkCoherence(rs) {}

var s = newRuleSet();

addDependency('option A', 'option B', s);
addDependency('option A', 'option B', s);
addDependency('option B', 'option C', s);
addDependency('option C', 'option D', s);

console.log(s.options);
