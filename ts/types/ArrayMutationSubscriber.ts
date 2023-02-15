import ArrayMutation from "./ArrayMutation";

type ArrayMutationSubscriber<T> = (arg: ArrayMutation<T>) => void;

export default ArrayMutationSubscriber;
