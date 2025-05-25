//----------------------
// Types
//----------------------

export type TIsNegative<T extends number> = `${T}` extends `-${string}` ? true : false;
