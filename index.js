function newRuleSet() {
  return {
    options: {
    }
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
  for (const key of Object.keys(rs.options)) {
    for ( let i=0; i<rs.options[key].isInConflictWith.length;   i++ ) {
      // check conflicts against dependencies
      if ( rs.options[key].isDependentOn.includes( rs.options[key].isInConflictWith[i] ) ) {
        return false;
      }
    }
  }
  return true;
}

let s = newRuleSet();

addDependency('option A', 'option A', s);

//checkCoherence(s);
console.assert( checkCoherence(s) );

console.log(s.options);
