/**
 * This is where we get into "Wow" territory. Up until now, 
 * we've focused on leveraging TS in a way that makes it difficult
 * for consumers or extenders of code to mess up. 
 * But here, enforcing consideration of all possible code paths, 
 * we're focusing more on "making TS make us write code that needs to be written". 
 * How do we add a new option/color/flavor/dogBreed to a feature and ensure 
 * that all code that forks on that option is considered and properly updated to handle
 * the additional value? 
 */

enum DogBreed {
  GOLDEN_RETRIEVER = "GOLDEN_RETRIEVER",
  GERMAN_SHEPHERD = "GERMAN_SHEPHERD",
  // Uncomment and comment this to view compiler errors.
  HUSKY = "HUSKY",
}

interface Dog {
  dogId: string;
  dogBreed: DogBreed;
}

/**
 * Helper function to ensure a value's type is `never`. 
 */
function assertNever(value: never): never {
  throw new Error(`Expected never but value was: ${value}`);
}

const doFancyLogic = (): Dog => {
  throw new Error("Not implemented.");
};

const doRegularLogic = (): Dog => {
  throw new Error("Not implemented.");
};

const firstDetermineDogProtocol = (
  dog: Dog
): Dog => {
  if (dog.dogBreed === DogBreed.GOLDEN_RETRIEVER) {
    return doFancyLogic();
    // Note the importance of `else if` vs `else`. 
  } else if (dog.dogBreed === DogBreed.GERMAN_SHEPHERD) {
    return doRegularLogic();
  }

  // The value could be `ATL`, but the function only takes in `never`, 
  // so we get a compiler error! 
  return assertNever(dog.dogBreed);

  // Note the importance of specifying the return type of this function. 
  // We don't have to if we have `noImplicitReturn` on, but it's helpful in that it 
  // creates the compiler error within the function, instead of on consuming code
  // that tries to operate on an `Dog | undefined` type. 
};

// Info on why `if` statements get different treatment from `switch`:
// - https://github.com/Microsoft/TypeScript/issues/8655#issuecomment-412685082
// - https://github.com/microsoft/TypeScript/issues/20409#issuecomment-348715951
const secondDetermineDogProtocol = (
  dog: Dog
): Dog => {
  // Totally works. Only "con" is that switches are generally
  // considered less readable than other alternatives (subjective!).
  switch (dog.dogBreed) {
    case DogBreed.GOLDEN_RETRIEVER:
      return doFancyLogic();
    case DogBreed.GERMAN_SHEPHERD:
      return doRegularLogic();
  }
  // Additional case has to be added for ATL to resolve compiler error.

};

const thirdDetermineDogProtocol = (
  dog: Dog
): Dog => {
  // Here, we create a mapping of location to function.
  const locationToProtocolMap = {
    [DogBreed.GOLDEN_RETRIEVER]: doFancyLogic,
    [DogBreed.GERMAN_SHEPHERD]: doRegularLogic,
    [DogBreed.HUSKY]: doRegularLogic
  }; 

  // Cool in that we don't need a `switch` or `throw`.
  // More pros: https://docs.google.com/presentation/d/15ntBGQiVcV7EY0toN21s0JtKXC3K1EfjfTPOHGR6pFs/edit#slide=id.gd266fef68f_0_21
  return locationToProtocolMap[dog.dogBreed]();
};

/**
 * We can also use mapped types to enforce that "config objects"
 * contain entries for every necessary key. 
 */
const dogBreedInfoMap: {
  [k in DogBreed]: { color: string; label: string };
} = {
  [DogBreed.GOLDEN_RETRIEVER]: {
    color: "blue",
    label: "Chicago",
  },
  [DogBreed.GERMAN_SHEPHERD]: {
    color: "green",
    label: "Research Triangle Park",
  },
};

/**
 * This won't always be possible, but the more you can structure your types in a way
 * that forces you to handle every possible type, the less you can think! 
 */