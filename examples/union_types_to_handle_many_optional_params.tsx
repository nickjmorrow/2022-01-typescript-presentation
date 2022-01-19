/**
 * It's a very common "programming problem" where, you have a function,
 * and it takes in multiple optional parameters, but you implicitly
 * don't allow just any combination of optional params.
 * Ex: if the first is provided then so should the second,
 * and if the third is provided, then the fourth should not be provided.
 */

/**
 * Option 1: multiple optional parameters
 */
interface IFirstTextInputProps {
  isLoading?: boolean;
  isErrored?: boolean;
  errorText?: string;
  value: string;
}

const MyFirstTextInput = ({
  isLoading,
  isErrored,
  value,
  errorText,
}: IFirstTextInputProps) => {
  // Button cannot be loading and in an error state simultaneously.
  // We add a runtime check.
  if (isLoading && isErrored) {
    throw new Error(
      "Field cannot be loading and have an error or disabled state."
    );
  }

  // If button is in an error state, error text must be provided.
  // Another runtime check.
  if (isErrored && !errorText) {
    throw new Error("Field cannot have error state without error text.");
  }

  // Assume there is logic here to actually render the field
  // with error / loading UI.
  return <input>{value}</input>;
};

/**
 * Option 2: tagged union type
 */
type SecondTextInputProps = { value: string } & (
  | {
      type: "default";
    }
  | { type: "loading" }
  | { type: "error"; errorText: string }
);

const MySecondTextInput = (props: SecondTextInputProps) => {
  if (props.type === "error") {
    /**
     * TS knows that if `props.type === "error"`, then the shape of the object
     * matches `{ type: "error"; errorText: string }` and has the `errorText` key.
     */
    return (
      <label>
        {/* No need to check if this value exists, we know it does! */}
        {props.errorText}
        <input></input>
      </label>
    );
  }

  if (props.type === "loading") {
    return <input style={{ color: "gray" }}>LOADING</input>;
  }

  return <input>{props.value}</input>;
};

const ParentComponent = () => {
  /**
   * Able to specify a loading and error state. Did not have to
   * specify `errorText`.
   */
  const firstField = (
    <MyFirstTextInput isLoading={true} isErrored={true} value={"some text"} />
  );

  /**
   * Couldn't specify `error` without `errorText`!
   * And it is now impossible to specify both an error and loading state.
   */
  const secondField = (
    // Property 'errorText' is missing in type
    <MySecondTextInput type="error" value={"some text"} />
  );

  /**
   * Coudn't specify `errorText` without `error`!
   */
  const thirdField = (
    <MySecondTextInput
      type="default"
      // Property 'errorText' does not exist on type
      errorText="some error"
      value={"some text"}
    />
  );

  return;
};

/**
 * This is particularly helpful in frontend code where you're constantly
 * passing values in between functions and want your function's API to
 * be as explicit as possible about how the function can be used.
 * Article on tagged unions: https://mariusschulz.com/blog/tagged-union-types-in-typescript
 */
