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
  console.log(s);
  if ( s.includes(o) ){
    let pos = s.indexOf(o);
    s.splice(pos,1);
    //and also any associated options
    for ( let i=0; i<rs.options[o].isParentTo.length; i++ ) {
      let pos = s.indexOf(rs.options[o].isParentTo[i]);
      s.splice(pos,1);
    }
  } else {
    s.push(o)
    //and also any associated options
    for ( let i=0; i<rs.options[o].isDependentOn.length; i++ ) {
      s.push(rs.options[o].isDependentOn[i]);
    }
  }
}


let s = newRuleSet();

addDependency('option A', 'option A', s);

//checkCoherence(s);
console.assert( checkCoherence(s) );

require(['test.js']);
