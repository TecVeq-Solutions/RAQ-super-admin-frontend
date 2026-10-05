import { Client, Package, License } from '../types';

export const mockClients: Client[] = [
    { id: '1', companyName: 'Acme Corp', owner: 'John Doe', email: 'john@acme.com', phone: '123-456-7890', package: 'Enterprise', licenseStatus: 'Active', users: 45, createdAt: '2023-01-15' },
    { id: '2', companyName: 'TechStart', owner: 'Jane Smith', email: 'jane@techstart.io', phone: '098-765-4321', package: 'Pro', licenseStatus: 'Active', users: 12, createdAt: '2023-05-20' },
    { id: '3', companyName: 'Global Retail', owner: 'Mike Johnson', email: 'mike@global.com', phone: '555-123-4567', package: 'Basic', licenseStatus: 'Expired', users: 5, createdAt: '2022-11-10' }
];

export const mockPackages: Package[] = [
    { id: '1', name: 'Basic', description: 'Essential tools for small business', price: 49, billingCycle: 'Monthly', userLimit: 5, status: 'Active', modules: ['Sales', 'Purchases'] },
    { id: '2', name: 'Pro', description: 'Advanced features for growing teams', price: 99, billingCycle: 'Monthly', userLimit: 20, status: 'Active', modules: ['Sales', 'Purchases', 'Inventory', 'Reports'] },
    { id: '3', name: 'Enterprise', description: 'Full suite for large organizations', price: 299, billingCycle: 'Monthly', userLimit: 100, status: 'Active', modules: ['Sales', 'Purchases', 'Inventory', 'Reports', 'Accounting', 'Manufacturing'] }
];

export const mockLicenses: License[] = [
    { id: '1', key: 'LIC-ACME-2023-XYZ', clientId: '1', clientName: 'Acme Corp', packageName: 'Enterprise', status: 'Active', issueDate: '2023-01-15', expiryDate: '2024-01-15' },
    { id: '2', key: 'LIC-TECH-2023-ABC', clientId: '2', clientName: 'TechStart', packageName: 'Pro', status: 'Active', issueDate: '2023-05-20', expiryDate: '2024-05-20' },
    { id: '3', key: 'LIC-GLOB-2022-DEF', clientId: '3', clientName: 'Global Retail', packageName: 'Basic', status: 'Expired', issueDate: '2022-11-10', expiryDate: '2023-11-10' }
];
