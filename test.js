// Import your code here

var s, selected;

s = newRuleSet();
addDependency('a', 'a', s);
console.assert(checkCoherence(s));

s = newRuleSet();
addDependency('a', 'b', s);
addDependency('b', 'a', s);
console.assert(checkCoherence(s));

s = newRuleSet();
addDependency('a', 'b', s);
addConflict('a', 'b', s);
console.assert(!checkCoherence(s));

s = newRuleSet();
addDependency('a', 'b', s);
addDependency('b', 'c', s);
addConflict('a', 'c', s);
console.assert(!checkCoherence(s));

s = newRuleSet();
addDependency('a', 'b', s);
addDependency('b', 'c', s);
addDependency('c', 'a', s);
addDependency('d', 'e', s);
addConflict('c', 'e', s);
console.assert(checkCoherence(s));

// This function takes some arguments and returns a set of selected options.
// If needed, you should replace it with your own data structure.
function set() {
  var l = {};
  for (var i in arguments) {
    l[arguments[i]] = true;
  }
  return l;
}

// This function returns whether two sets of selected options have the same options selected.
// If needed, you should reimplement it for your own data structure.
function setsEqual(a, b) {
  var ka = Object.keys(a).sort();
  var kb = Object.keys(b).sort();
  if (ka.length != kb.length) {
    return false;
  }
  for (var i in ka) {
    if (kb[i] != ka[i]) {
      return false;
    }
  }
  return true;
}

selected = set();  // Or list, array, etc.

console.log(set('a', 'c', 'b'))
toggle(selected, 'a', s);
console.assert(setsEqual(selected, set('a', 'c', 'b')));

//s = addDependency('f', 'f', s);
//selected = toggle(selected, 'f', s);
//console.assert(setsEqual(selected, set('a', 'c', 'b', 'f')));

//selected = toggle(selected, 'e', s);
//console.assert(setsEqual(selected, set('e', 'f')));

//selected = toggle(selected, 'b', s);
//console.assert(setsEqual(selected, set('a', 'c', 'b', 'f')));

//s = addDependency('b', 'g', s);
//selected = toggle(selected, 'g', s);
//selected = toggle(selected, 'b', s);
//console.assert(setsEqual(selected, set('g', 'f')));

//s = newRuleSet();
//s = addDependency('a', 'b', s);
//s = addDependency('b', 'c', s);
//selected = set();
//selected = toggle(selected, 'c', s);
//console.assert(setsEqual(selected, set('c')));

// Deep dependencies
s = newRuleSet();
addDependency('a', 'b', s);
addDependency('b', 'c', s);
addDependency('c', 'd', s);
addDependency('d', 'e', s);
addDependency('a', 'f', s);
addConflict('e', 'f', s);
console.log(s);
console.assert(!checkCoherence(s));

// Multiple dependencies and exclusions.

s = newRuleSet();
addDependency('a', 'b', s);
addDependency('a', 'c', s);
addConflict('b', 'd', s);
addConflict('b', 'e', s);
console.assert(checkCoherence(s));
//selected = set();
//selected = toggle(selected, 'd', s);
//selected = toggle(selected, 'e', s);
//selected = toggle(selected, 'a', s);
//console.assert(setsEqual(selected, set('a', 'c', 'b')));
