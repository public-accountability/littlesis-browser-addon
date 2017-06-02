  // str, str, [school] -> [int] | Throw Exception
  function relationshipCategories(entity1, entity2) {
    var all = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
    var personToPerson = [1, 3, 4, 5, 6, 8, 9, 12];
    var personToOrg = [1, 2, 3, 5, 6, 10, 12];
    var orgToPerson = [1, 3, 5, 6, 10, 12];
    var orgToOrg = [1, 2, 3, 5, 6, 10, 11, 12];

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



    // if (entity1 === 'Person' && entity2 === 'Person') {
    //   return personToPerson;
    // } else if (entity1 === 'Person' && entity2 === 'Org') {
    //   return personToOrg;
    // } else if (entity1 === 'Org' && entity2 === 'Person') {

    //   // if entity is a school, provide the option to
    //   // create a student relationship
    //   if (typeof entityInfo('school') !== 'undefined' && entityInfo('school') === 'true') {
    //     orgToPerson.splice(1, 0, 2);
    //   }
    //   return orgToPerson;
      
    // } else if (entity1 === 'Org' && entity2 === 'Org') {
    //   return orgToOrg;
    // } else {
    //   throw "Missing or incorrect primary extension type"; 
    // }
  }