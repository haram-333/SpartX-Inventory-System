/**
 * Helper function to get the correct collection name based on user role
 */
export function getCollectionByRole(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return 'admins'
    case 'PRODUCTION':
      return 'production_employees'
    case 'WAREHOUSE':
      return 'warehouse_employees'
    case 'SALES':
      return 'sales_employees'
    case 'ACCOUNTS':
      return 'accounts_employees'
    default:
      throw new Error(`Invalid role: ${role}`)
  }
}

/**
 * Get all employee collections
 */
export function getAllEmployeeCollections(): string[] {
  return [
    'admins',
    'production_employees',
    'warehouse_employees',
    'sales_employees',
    'accounts_employees'
  ]
}

