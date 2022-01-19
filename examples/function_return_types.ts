/**
 * Most function return types are easy to understand. They can return
 * the exact same types we use for any variable. But `void` and `unknown`
 * tend to be used more for function return types. What's the difference?
 */

/**
 * Most people are familiar with void, but it's helpful to compare it
 * to `unknown` below. Void tends to be used for side effects, like
 * "start this cron job" or "make this network request that has no response value".
 */
function makesSideEffect(): void {
  throw new Error("Not implemented.");
}

/**
 * Here, we use `unknown` to convey "Hey if you call this function,
 * you should do some checks on the value because the type isn't clear."
 * This can be nice when you need to return untyped JSON.
 */
function getsUntypedValue(): unknown {
  throw new Error("Not implemented.");
}

/**
 * Additionally, the built-in `ReturnType` can be used
 * to get the return type of a function.
 * Note that declaring a type like this below is great for
 * iterating on a type and troubleshooting.
 */
type X = ReturnType<typeof getsUntypedValue>;

interface Cat {
  id: string;
}

const addCatActionCreator = (cat: Cat) => ({
  type: "ADD_CAT",
  payload: cat,
});

/**
 * Normally, you'll want to use "explicit / concrete" types when describing
 * what can go into or out of a function, so that type errors occur as close to the
 * code that needs to change as possible.
 * But for use cases like Redux, where you need to create many action creators
 * and don't want to create an interface for each return type, this is a life saver.
 * Here, the saga references the return type of the action creator.
 */
const addCatSaga = ({
  payload,
}: ReturnType<typeof addCatActionCreator>) => {
  console.log(payload);
};
