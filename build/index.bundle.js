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
      isDependentOn: [],
      isInConflictWith: []
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

function addConflict(o, t, rs) {
  // check that option exists
  addOption(o, rs);
  // check that target-option exists
  addOption(t, rs);
  // add conflict if it doesn't already exist
  if (!rs.options[o].isInConflictWith.includes(t)) {
    rs.options[o].isInConflictWith.push(t);
  }
  if (!rs.options[t].isInConflictWith.includes(o)) {
    rs.options[t].isInConflictWith.push(o);
  }
}

function checkCoherence(rs) {
  // loop through each option
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(rs.options)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      for (var i = 0; i < rs.options[key].isInConflictWith.length; i++) {
        // check conflicts against dependencies
        if (rs.options[key].isDependentOn.includes(rs.options[key].isInConflictWith[i])) {
          return false;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
}

var s = newRuleSet();

addDependency('option A', 'option B', s);
addDependency('option B', 'option C', s);
addConflict('option A', 'option D', s);

//checkCoherence(s);
console.assert(checkCoherence(s));

console.log(s.options);
