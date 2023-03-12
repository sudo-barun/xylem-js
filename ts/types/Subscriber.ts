import SubscriberFunction from "./SubscriberFunction";
import SubscriberObject from "./SubscriberObject";

type Subscriber<T> = SubscriberFunction<T> | SubscriberObject<T>;

export default Subscriber;
