/**
 * String types are great for when you have no idea what form 
 * the string could be in, like when taking in user input. 
 * But there are usually narrower types that can be used when 
 * the string can only take one of a set of possible values. 
 */

// Here, we take in `status` as a string. 
const canDogBeUpdated = (status: string, isUserAdmin: boolean): boolean => {
    if (isUserAdmin) {
        return true;
    }

    // We compare to known possible values of `status`. 
    if (status === 'DELETED' || status === 'COMPLETED') {
        return false;
    }

    return true;
}

const dogStatuses = {
    IN_PROGRESS: 'IN_PROGRESS',
    DELETED: 'DELETED',
    COMPLETED: 'COMPLETED',
} as const; // Note that `as const` usage. 
// Remove it and re-add it. How does the type change?

type DogStatusUnionStringLiteral = 'IN_PROGRESS' | 'DELETED' | 'COMPLETED';

enum DogStatusEnum {
    IN_PROGRESS = 'IN_PROGRESS',
    DELETED = 'DELETED',
    COMPLETED = 'COMPLETED',
}

// "Helper" type to grab the values of keys of an object,
// like the one above. 
type ValuesOfObject<T> = T[keyof T];


/**
 * There are many ways to use a narrower type, each with pros and cons. 
 * Here, I'm just going to use an enum. 
 */
const secondCanDogBeUpdated = (status: DogStatusEnum, isUserAdmin: boolean): boolean => {
// const secondCanDogBeUpdated = (status: DogStatusUnionStringLiteral, isUserAdmin: boolean): boolean => {
    // const secondCanDogBeUpdated = (status: typeof dogStatuses[keyof typeof dogStatuses], isUserAdmin: boolean): boolean => {
    // const secondCanDogBeUpdated = (status: ValuesOfObject<typeof dogStatuses>, isUserAdmin: boolean): boolean => {
    if (isUserAdmin) {
        return true;
    }
    
    if (status === DogStatusEnum.DELETED || status === DogStatusEnum.COMPLETED) {
        return false;
    }

    return true;
}