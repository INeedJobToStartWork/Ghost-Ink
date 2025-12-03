import { useMemo, useState } from "react";

//----------------------
// Types
//----------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TReducerAction<S = any, A = any> = (state: S, action: A) => S;

type TReturn<GReducers extends Record<string, TReducerAction>> = {
	dispatch: { [K in keyof GReducers]: (action: Parameters<GReducers[K]>[1]) => void };
	state: { [K in keyof GReducers]: ReturnType<GReducers[K]> };
};

//----------------------
// Functions
//----------------------

/**
 * Connects multiple reducers to a single state object.
 *
 * @example
 * ```ts
 * const [state, dispatch] = useReducerConnector({
 * 	cursorReducer,
 * 	stringReducer
 * }, {
 * 	cursorReducer: 0,
 * 	stringReducer: ""
 * });
 * ```
 *
 * @returns [state, dispatch]
 */
export const useReducerConnector = <GReducers extends Record<string, TReducerAction>>(
	reducers: GReducers,
	initialState: { [K in keyof GReducers]: ReturnType<GReducers[K]> }
): TReturn<GReducers> => {
	const [state, setState] = useState<{ [K in keyof GReducers]: ReturnType<GReducers[K]> }>(initialState);

	const dispatch = useMemo(() => {
		const results = {} as TReturn<GReducers>["dispatch"];

		for (const key of Object.keys(reducers) as Array<keyof GReducers>) {
			results[key] = (action: Parameters<GReducers[typeof key]>[1]) => {
				setState(prev => ({
					...prev,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					[key]: reducers[key](prev[key], action)
				}));
			};
		}

		return results;
	}, [reducers]);

	return { state, dispatch };
};

export default useReducerConnector;
