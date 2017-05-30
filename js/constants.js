var BASEURL = 'http://localhost:8080';

var DROPDOWN_TEXT_PRESENT = {
	1: 'is an employee of',
	2: 'attends',
	3: 'is a member of',
	4: 'is related to',
	5: 'gives money to',
	6: 'provides a service to',
	7: 'lobbies',
	8: 'is friends with',
	9: 'has a professional relationship with',
	10: 'owns',
	11: 'is a suborganization of',
	12: 'has some other relationship with'
};

var DROPDOWN_TEXT_PAST = {
	1: 'was an employee of',
	2: 'attended',
	3: 'was a member of',
	4: 'was related to',
	5: 'gave money to',
	6: 'provided a service to',
	7: 'lobbied',
	8: 'was friends with',
	9: 'had a professional relationship with',
	10: 'owned',
	11: 'was a suborganization of',
	12: 'had some other relationship with'
};

var RELATIONSHIP_TYPES = {
	1: {id: 1, name: "Position", display_name: "Position", default_description: "Position", entity1_requirements: "Person", entity2_requirements: null, has_fields: true},
	2: {id: 2, name: "Education", display_name: "Education", default_description: "Student", entity1_requirements: "Person", entity2_requirements: "Org", has_fields: true},
	3: {id: 3, name: "Membership", display_name: "Membership", default_description: "Member", entity1_requirements: null, entity2_requirements: null, has_fields: true},
	4: {id: 4, name: "Family", display_name: "Family", default_description: "Relative", entity1_requirements: "Person", entity2_requirements: "Person", has_fields: true},
	5: {id: 5, name: "Donation", display_name: "Donation/Grant", default_description: "Donation/Grant", entity1_requirements: null, entity2_requirements: null, has_fields: true},
	6: {id: 6, name: "Transaction", display_name: "Service/Transaction", default_description: "Service/Transaction", entity1_requirements: null, entity2_requirements: null, has_fields: true},
	7: {id: 7, name: "Lobbying", display_name: "Lobbying", default_description: "Lobbying", entity1_requirements: null, entity2_requirements: null, has_fields: true},
	8: {id: 8, name: "Social", display_name: "Social", default_description: "Social", entity1_requirements: "Person", entity2_requirements: "Person", has_fields: true},
	9: {id: 9, name: "Professional", display_name: "Professional", default_description: "Professional", entity1_requirements: "Person", entity2_requirements: "Person", has_fields: true},
	10:{id: 10, name: "Ownership", display_name: "Ownership", default_description: "Owner", entity1_requirements: null, entity2_requirements: "Org", has_fields: true},
	11:{id: 11, name: "Hierarchy", display_name: "Hierarchy", default_description: "Hierarchy", entity1_requirements: "Org", entity2_requirements: "Org", has_fields: true},
	12:{id: 12, name: "Generic", display_name: "Generic", default_description: "Affiliation", entity1_requirements: null, entity2_requirements: null, has_fields: true}
};
