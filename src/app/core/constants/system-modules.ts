export const companyModules = [
    {
      moduleId: 1,
      key: 'hr',
      moduleName: 'Human Resources Module',
      moduleFeatures: [
        {
          featureId: 1,
          featureKey: 'employeeManagement',
          featureName: 'Employee Management',
          featurePermissions: [
            {
              key: 'canCreateEmployees',
              name: 'Create Employees',
              value: true
            },
            {
              key: 'canViewEmployees',
              name: 'View Employees',
              value: true
            },
            {
              key: 'canUpdateEmployees',
              name: 'Update Employees',
              value: true
            },
            {
              key: 'canDeleteEmployees',
              name: 'Delete Employees',
              value: true
            }
          ]
        },
        {
          featureId: 2,
          featureKey: 'expenseManagement',
          featureName: 'Expense Management',
          featurePermissions: [
            {
              key: 'canCreateEmployees',
              name: 'Create Employees',
              value: true
            },
            {
              key: 'canViewEmployees',
              name: 'View Employees',
              value: true
            },
            {
              key: 'canUpdateEmployees',
              name: 'Update Employees',
              value: true
            },
            {
              key: 'canDeleteEmployees',
              name: 'Delete Employees',
              value: true
            }
          ]
        }
      ]
    },
    {
      moduleId: 2,
      key: 'order',
      moduleName: 'Order Management Module',
      moduleFeatures: []
    }
]