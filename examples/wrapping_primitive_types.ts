/**
 * Generally, primitive types (string, number, boolean) don't carry 
 * much type information that lets you compare different primitives. 
 * "Branding" lets you add additional type information to prevent 
 * getting primitives mixed up. 
 */

// Function takes in a labCatId `string`. 
const findByLabCatId = (labCatId: string) => {
    // logic to look up a cat by labCatId
    throw new Error('Not implemented.');
}

// Whoops! Accidentally passed in a UUID when I should've used
// a labCatId. But TS is just letting it fly, that's unfortunate. 
findByLabCatId('be1360af-433f-4bbd-be81-6c15b63dc2f7')

/**
 * Here, we're adding this additional `_brand` property. It won't 
 * ever be actually accessed. It's just a tool to append more type information. 
 */
type LabCatId = string & { _brand: 'labCatId' };

// This function takes in a `LabCatId` type. 
const findByLabCatIdBranded = (labCatId: LabCatId) => {
    // logic to look up a cat by labCatId
    throw new Error('Not implemented.');    
}



// Here's another UUID string. 
let myUuid = 'be1360af-433f-4bbd-be81-6c15b63dc2f7';
myUuid._brand = "labCatId";


// Argument of type 'string' is not assignable to parameter of type 'LabCatId'!
// Great! TS yelled at me as soon as I made this mistake. 
findByLabCatIdBranded(myUuid);

// Type guard to validate that a string is a `LabCatId`. 
function isLabCatId(value: string): value is LabCatId {
    // Test to check that the string is a labCatId.
    // Not fully fleshed out. 
    const valueArr = value.split('');
    return Number.parseInt(valueArr.slice(0, 2).join(), 0) === 21 && valueArr[2] === '-';
}

const myLabCatId = '21-A00001';

if (!isLabCatId(myLabCatId)) {
    throw new Error('LabCatId is not valid.')
}

// TS now knows the string is a labCatId
// because of the type guard and conditional above. 
findByLabCatIdBranded(myLabCatId);

// Note that we can't just use a type annotation here, 
// we have to use type guards or type assertions. 
// This can be a bit frustrating for types that don't really
// "need" additional validation, like comparing feet to meters. 
// LabCatIds have an actual format and structure, but feet and meters don't,
// they're just numbers. 
const otherLabCatId: LabCatId = '21-A00002';

// Helper function to type assert the value. 
const makeLabCatId = (value: string): LabCatId => value as LabCatId;

// We can wrap type assertions in a function to make it more convenient. 
const fourthLabCatId = makeLabCatId('21-A00002');

/**
 * "Flavoring" is another approach. The big difference is that 
 * `brand` is made optional. This lets you annotate primitives as 
 * `FlavorLabCatId` without needing to do any additional checks or assertions.
 */
type FlavorLabCatId = string & {
    // Optional now! 
    _brand?: 'labCatId';
}

type FlavorUuid = string & {
    _brand?: 'uuid';
}


const findByLabCatIdFlavored = (labCatId: FlavorLabCatId) => {
    // logic to look up a cat by labCatId
    throw new Error('Not implemented.');    
}
// We can just use annotations. 
const thirdLabCatId: FlavorLabCatId = '21-A00002';

findByLabCatIdFlavored(thirdLabCatId);

// Unflavored values (like `string`) are allowed! 
// A bit more dangerous! 
findByLabCatIdFlavored("some string");

const secondUuid: FlavorUuid = 'be1360af-433f-4bbd-be81-6c15b63dc2f7';

// But values from different flavors are disallowed. 
// Nice if you can consistently flavor the values that would benefit from it 
// and don't want to worry about the primitives that wouldn't benefit as much. 
findByLabCatIdFlavored(secondUuid);

/**
 * Articles like https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
 * review the pros/cons of each approach. It's just a question of what you're comfortable allowing
 * and how much friction (type guards, type assertions) you're willing to deal with. 
 */