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
    };
  }
}

function addDependency(o, t, rs){
  // check that option exists
  addOption(o, rs);
  // check that target-option exists
  addOption(t, rs);
}

function addConflict(o, t, rs){
}

function checkCoherence(rs){
}

let s = newRuleSet();

addDependency('option A', 'option B', s)

console.log(s.options);
