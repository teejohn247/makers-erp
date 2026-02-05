export interface SubscriptionInfo {
    id: string;
    subscriptionPlan: string;
    subscriptionCycle: string;
    rangeOfUsers: number;
    noOfUsers: number;
    optionalModules: any;
    unitPrice: number;
    flatRate: number;
    startDate: string;
    endDate: string;
}