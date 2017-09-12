'use strict';

function newRuleSet() {
  return {
    options: {},
    conflicts: []
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

  // ignore if o = t
  if (o == t) {
    return;
  }

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

  // ignore if o = t
  if (o == t) {
    return;
  }

  // add conflict to main object prop
  rs.conflicts.push([o, t]);
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

      // check against main conflict prop
      for (var i = 0; i < rs.conflicts.length; i++) {
        if (rs.options[key].isDependentOn.includes(rs.conflicts[i][0]) && rs.options[key].isDependentOn.includes(rs.conflicts[i][1])) {
          return false;
        }
      }
      // check conflicts against dependencies
      for (var _i2 = 0; _i2 < rs.options[key].isInConflictWith.length; _i2++) {
        if (rs.options[key].isDependentOn.includes(rs.options[key].isInConflictWith[_i2])) {
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

function toggle(s, o, rs) {
  console.log(rs);
  if (s[o]) {
    delete s[o];
    //and also any associated options
    for (var i = 0; i < rs.options[o].isParentTo.length; i++) {
      delete s[rs.options[o].isParentTo[i]];
    }
  } else {
    s[o] = true;
    //toggle any conflicts
    for (var _i3 = 0; _i3 < rs.options[o].isInConflictWith.length; _i3++) {
      var current = rs.options[o].isInConflictWith[_i3];
      delete s[current];
      for (var j = 0; j < rs.options[current].isParentTo.length; j++) {
        delete s[rs.options[current].isParentTo[j]];
      }
    }
    //and also any associated options
    for (var _i4 = 0; _i4 < rs.options[o].isDependentOn.length; _i4++) {
      var _current2 = rs.options[o].isDependentOn[_i4];
      s[_current2] = true;
      for (var _j = 0; _j < rs.options[_current2].isInConflictWith.length; _j++) {
        delete s[rs.options[_current2].isInConflictWith[_j]];
      }
    }
  }
  console.log(s);
}

require(['test.js']);
