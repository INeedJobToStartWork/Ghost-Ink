import { useRef, useEffect } from "react";

//----------------------
// Functions
//----------------------

/**
 * A custom React hook that watches a value and returns a reference to the current value.
 *
 * @example
 * const [state, setStateDispatch] = useReducer(reducer, initialState);
 * const currentState = useWatcher(state);
 */
export function useWatcher<T>(reducerTuple: T) {
	const state = reducerTuple;
	const currentRef = useRef(state);

	useEffect(() => {
		currentRef.current = state;
	}, [state]);

	return currentRef;
}
