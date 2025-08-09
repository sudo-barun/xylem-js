import type SubscriberFunction from "./SubscriberFunction";
import type SubscriberObject from "./SubscriberObject";

type Subscriber<T> = SubscriberFunction<T> | SubscriberObject<T>;

export { type Subscriber as default };
