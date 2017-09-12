function newRuleSet() {
  return {
    options: {
    },
    conflicts: [],
  }
};

function addOption(title, rs) {
	if ( !rs.options[title] ) {
    	rs.options[title] = {
    	isParentTo: [],
    	isDependentOn: [],
      isInConflictWith: [],
    };
  }
}

function addDependency(o, t, rs){
  // check that option exists
  addOption(o, rs);
  // check that target-option exists
  addOption(t, rs);

  // ignore if o = t
  if ( o == t ) {
    return;
  }

  // add dependency if it doesn't already exist
  if ( !rs.options[o].isDependentOn.includes(t) ){
    rs.options[o].isDependentOn.push(t);
  }
  // check all options associated, add dependency
  for ( let i=0; i<rs.options[o].isParentTo.length; i++ ) {
    let current = rs.options[o].isParentTo[i];
    if ( !rs.options[current].isDependentOn.includes(t) ){
      rs.options[current].isDependentOn.push(t);
    }
  }
  // add parent-role to target-option
  if ( !rs.options[t].isParentTo.includes(o) ){
    rs.options[t].isParentTo.push(o);
  }
  // check for other necessary parent-roles
  for ( let i=0; i<rs.options[o].isParentTo.length; i++ ) {
    let current = rs.options[o].isParentTo[i];
    if ( !rs.options[t].isParentTo.includes(current) ){
      rs.options[t].isParentTo.push(current);
    }
  }
}

function addConflict(o, t, rs){
  // check that option exists
  addOption(o, rs);
  // check that target-option exists
  addOption(t, rs);

  // ignore if o = t
  if ( o == t ) {
    return;
  }

  // add conflict to main object prop
  rs.conflicts.push([o,t]);
  // add conflict if it doesn't already exist
  if ( !rs.options[o].isInConflictWith.includes(t) ){
    rs.options[o].isInConflictWith.push(t);
  }
  if ( !rs.options[t].isInConflictWith.includes(o) ){
    rs.options[t].isInConflictWith.push(o);
  }
}

function checkCoherence(rs){
  // loop through each option
  for ( const key of Object.keys(rs.options) ) {
    // check against main conflict prop
    for ( let i=0; i<rs.conflicts.length; i++ ) {
      if ( rs.options[key].isDependentOn.includes(rs.conflicts[i][0]) && rs.options[key].isDependentOn.includes(rs.conflicts[i][1]) ) {
        return false;
      }
    }
    // check conflicts against dependencies
    for ( let i=0; i<rs.options[key].isInConflictWith.length;   i++ ) {
      if ( rs.options[key].isDependentOn.includes( rs.options[key].isInConflictWith[i] ) ) {
        return false;
      }
    }
  }
  return true;
}

function toggle(s, o, rs){
  console.log(rs);
  if ( s[o] ){
    delete s[o];
    //and also any associated options
    for ( let i=0; i<rs.options[o].isParentTo.length; i++ ) {
      delete s[rs.options[o].isParentTo[i]];
    }
  } else {
    s[o] = true;
    //toggle any conflicts
    for ( let i=0; i<rs.options[o].isInConflictWith.length; i++ ) {
      let current = rs.options[o].isInConflictWith[i];
      delete s[current];
      for ( let j=0; j<rs.options[current].isParentTo.length; j++ ) {
        delete s[rs.options[current].isParentTo[j]];
      }
    }
    //and also any associated options
    for ( let i=0; i<rs.options[o].isDependentOn.length; i++ ) {
      let current = rs.options[o].isDependentOn[i];
      s[current] = true;
      for ( let j=0; j<rs.options[current].isInConflictWith.length; j++ ) {
        delete s[rs.options[current].isInConflictWith[j]];
      }
    }

  }
  console.log(s);
}

require(['test.js']);
