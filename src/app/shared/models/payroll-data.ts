export interface PayrollTable {
    id: number;
    "Employee ID": string;
    "Image": string;
    "First Name": string;
    "Last Name": string;
    "Pay Period": string;
    "Phone Number": string;
    "Department": string;
    "Status": string
}

export interface PayrollSummary {
    id: number;
    "Reference": string;
    "Payroll Name": string;
    "Pay Period": string;
    "Employee Count": number;
    "Gross Pay": string;
    "Deductions": string;
    "Net Pay": string;
    "Status": string
}