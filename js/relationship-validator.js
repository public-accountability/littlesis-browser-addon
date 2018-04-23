  // 1: 'is an employee of',
  // 2: 'attends',
  // 3: 'is a member of',
  // 4: 'is related to',
  // 5: 'gives money to',
  // 6: 'provides a service to',
  // 7: 'lobbies',
  // 8: 'is friends with',
  // 9: 'has a professional relationship with',
  // 10: 'owns',
  // 11: 'is a suborganization of',
  // 12: 'has some other relationship with'

// ??????? supposedly:
    // var personToPerson = [1, 3, 4, 5, 6, 8, 9, 12];
    // var personToOrg = [1, 2, 3, 5, 6, 10, 12];
    // var orgToPerson = [1, 3, 5, 6, 10, 12];
// var orgToOrg = [1, 2, 3, 5, 6, 10, 11, 12];

function relationshipCategories(entity1, entity2) {
  var all = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
  var personToPerson = [1, 4, 5, 6, 8, 9, 12];
  var personToOrg = [1, 2, 3, 5, 6, 10, 12];
  var orgToPerson = [5, 6, 12];
  var orgToOrg = [3, 5, 6, 10, 11, 12];

  if (entity1 == 'Person' && entity2 == 'Person') {
    return personToPerson;
  }

  if (entity1 == 'Org' && entity2 == 'Org') {
    return orgToOrg;
  }

  if (entity1 == 'Person' && entity2 == 'Org') {
    return personToOrg;
  }

  if (entity1 == 'Org' && entity2 == 'Person') {
    return orgToPerson;
  }

  if (entity1 == 'Person') {
    return union(personToPerson, personToOrg);
  }

  if (entity1 == 'Org') {
    return union(orgToPerson, orgToOrg);
  }

  if (entity2 == 'Person') {
    return union(personToPerson, orgToPerson);
  }

  if (entity2 == 'Org') {
    return union(personToOrg, orgToOrg);
  }

  return all;

}
