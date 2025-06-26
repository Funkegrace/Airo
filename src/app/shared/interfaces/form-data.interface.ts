import { SubscriptionPlans } from "../literals";

export interface FormDataInterface {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    subscription: SubscriptionPlans;
}

export type FormDataInterfaceForLocalStorage = Omit<FormDataInterface, 'password'>;