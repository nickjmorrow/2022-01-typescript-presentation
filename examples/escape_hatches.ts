/**
 * Many people are aware of the myriad of escape hatches built into TS. 
 * // @ts-ignore and `any` usage are the most popular and certainly valid, 
 * but there are some less heavy-handed options that can sometimes be used. 
 * Here, we review in-line type assertions, declaration merging, and type guards.
 */

/**
 * Assume this is some type that you have little control over
 * and "just have to work with".
 */
interface SomeThirdPartyLibraryType {
    someProperty: string;
}

/**
 * Here, we're writing a function that works with that type. 
 */
const firstFunction = (value: SomeThirdPartyLibraryType) => {

    /**
     * Note that we are type asserting the type to `any` 
     * at the moment we need to use it in a way that breaks from its 
     * SomeThirdPartyLibraryType. 
     * This is really nice, because it doesn't "pollute" the rest of the function.
     * We could've made the function take in `value: any`, but that would mean that
     * for the lifetime of the function, the value would always be treated as `any`, even 
     * when we're accessing keys that exist on SomeThirdPartyLibraryType;
     */
    const someValue = (value as any).someOtherProperty;
    const otherValue = value.someProperty;
}

/**
 * Note that if the "type we can't work with" is expressed with an interface, 
 * we can use declaration merging to add additional properties. 
 */
interface SomeThirdPartyLibraryType {
    // We only need to specify the additional properties. 
    yetAnotherProperty: string;
}

const secondFunction = (value: SomeThirdPartyLibraryType) => {
    // The existing properties are still respected! 
    const otherValue = value.someProperty;
    const someValue = value.yetAnotherProperty;
}

const mouseStatuses = {
    IN_PROGRESS: 'IN_PROGRESS',
    DELETED: 'DELETED',
    COMPLETED: 'COMPLETED',
} as const;

interface Mouse {
    mouseId: string;
    status: string;
}

/**
 * We can also write functions (type guards) to check if a value matches a type. 
 * The type below is a little funky but it's just checking if the value passed in
 * matches one of the values in the `mouseStatuses` object. 
 */
function isMouseStatus(value: string): value is typeof mouseStatuses[keyof typeof mouseStatuses] {
    // Object.entries maintains the type of values, while Object.keys does not. 
    // Hover over the `e[1]` to view this. 
    // Note that this logic could be written incorrectly! So think it through! 
    return Object.entries(mouseStatuses).some(e => e[1] === value);
}

function canUpdateMouse(mouse: Mouse) {
    if (!isMouseStatus(mouse.status)) {
        throw new Error(`Unexpected mouse status: ${mouse.status}`);
    }

    /**
     * TS is looking at the control flow of this function, and knows that 
     * `mouse.status` cannot be anything other than a value in `mouseStatuses`
     * at this point in the function. 
     */
    console.log(mouse.status);
}