export interface Client {
    id: string;
    companyName: string;
    owner: string;
    email: string;
    phone: string;
    package: string;
    licenseStatus: 'Active' | 'Suspended' | 'Expired' | 'Pending';
    users: number;
    createdAt: string;
}

export interface Package {
    id: string;
    name: string;
    description: string;
    price: number;
    billingCycle: 'Monthly' | 'Yearly';
    userLimit: number;
    status: 'Active' | 'Draft' | 'Archived';
    modules: string[];
}

export interface License {
    id: string;
    key: string;
    clientId: string;
    clientName: string;
    packageName: string;
    status: 'Active' | 'Pending' | 'Suspended' | 'Expired' | 'Revoked';
    issueDate: string;
    expiryDate: string;
}
