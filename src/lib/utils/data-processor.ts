// Data processor utility for investment repayment data

export interface Repayment {
  productId: number;
  productName: string;
  scripCode: string;
  entityName: string;
  repaymentDate: number;
  status: string;
  principalRepayment: number;
  interestRepayment: number;
  tdsPercentage: number;
  tdsValue: number;
  totalRepaymentBeforeTds: number;
  totalRepaymentAfterTds: number;
  totalQuantity: number;
  repaymentType: string;
  transferredTo: {
    accountNo: string;
    bankLogo: string;
  };
  timeRanges: number[];
  productType: string;
  isTdsOnInterestApplicable: boolean;
  tdsExemptionThresholdAmount: number;
}

export interface RepaymentSummary {
  totalRepaymentNextMonth: number;
  totalRepaymentNextMonthAfterTds: number;
  totalRepaymentAllTime: number;
  totalRepaymentAllTimeAfterTds: number;
  totalRepaymentThisMonth: number;
  totalRepaymentThisMonthAfterTds: number;
  totalRepaymentThisFinancialYear: number;
  totalRepaymentThisFinancialYearAfterTds: number;
}

export interface InvestmentData {
  upcomingRepayments: {
    repaymentsList: Repayment[];
  } & RepaymentSummary;
}

// Format date from timestamp
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

// Get unique products from repayments list
export const getUniqueProducts = (repayments: Repayment[]): string[] => {
  const uniqueProducts = new Set<string>();
  repayments.forEach(repayment => uniqueProducts.add(repayment.productName));
  return Array.from(uniqueProducts);
};

// Get unique entities from repayments list
export const getUniqueEntities = (repayments: Repayment[]): string[] => {
  const uniqueEntities = new Set<string>();
  repayments.forEach(repayment => uniqueEntities.add(repayment.entityName));
  return Array.from(uniqueEntities);
};

// Get unique repayment types from repayments list
export const getUniqueRepaymentTypes = (repayments: Repayment[]): string[] => {
  const uniqueTypes = new Set<string>();
  repayments.forEach(repayment => uniqueTypes.add(repayment.repaymentType));
  return Array.from(uniqueTypes);
};

// Filter repayments based on criteria
export const filterRepayments = (
  repayments: Repayment[],
  filters: {
    product?: string;
    entity?: string;
    repaymentType?: string;
    dateRange?: { start: number; end: number };
  }
): Repayment[] => {
  return repayments.filter(repayment => {
    // Filter by product
    if (filters.product && repayment.productName !== filters.product) {
      return false;
    }
    
    // Filter by entity
    if (filters.entity && repayment.entityName !== filters.entity) {
      return false;
    }
    
    // Filter by repayment type
    if (filters.repaymentType && repayment.repaymentType !== filters.repaymentType) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange) {
      if (
        repayment.repaymentDate < filters.dateRange.start ||
        repayment.repaymentDate > filters.dateRange.end
      ) {
        return false;
      }
    }
    
    return true;
  });
};

// Sort repayments based on criteria
export const sortRepayments = (
  repayments: Repayment[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Repayment[] => {
  return [...repayments].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.repaymentDate - b.repaymentDate;
        break;
      case 'amount':
        comparison = a.totalRepaymentBeforeTds - b.totalRepaymentBeforeTds;
        break;
      case 'product':
        comparison = a.productName.localeCompare(b.productName);
        break;
      case 'entity':
        comparison = a.entityName.localeCompare(b.entityName);
        break;
      default:
        comparison = a.repaymentDate - b.repaymentDate;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

// Calculate monthly repayment totals for chart
export const calculateMonthlyTotals = (repayments: Repayment[]): { month: string; amount: number }[] => {
  const monthlyTotals: Record<string, number> = {};
  
  repayments.forEach(repayment => {
    const date = new Date(repayment.repaymentDate);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = 0;
    }
    
    monthlyTotals[monthYear] += repayment.totalRepaymentBeforeTds;
  });
  
  // Convert to array and sort by date
  return Object.entries(monthlyTotals)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      const aDate = new Date(`${aMonth} 1, ${aYear}`);
      const bDate = new Date(`${bMonth} 1, ${bYear}`);
      
      return aDate.getTime() - bDate.getTime();
    });
};

// Calculate repayment type distribution
export const calculateRepaymentTypeDistribution = (repayments: Repayment[]): { name: string; value: number }[] => {
  const typeDistribution: Record<string, number> = {};
  
  repayments.forEach(repayment => {
    if (!typeDistribution[repayment.repaymentType]) {
      typeDistribution[repayment.repaymentType] = 0;
    }
    
    typeDistribution[repayment.repaymentType] += repayment.totalRepaymentBeforeTds;
  });
  
  return Object.entries(typeDistribution).map(([name, value]) => ({ name, value }));
};

// Calculate product distribution
export const calculateProductDistribution = (repayments: Repayment[]): { name: string; value: number }[] => {
  const productDistribution: Record<string, number> = {};
  
  repayments.forEach(repayment => {
    if (!productDistribution[repayment.productName]) {
      productDistribution[repayment.productName] = 0;
    }
    
    productDistribution[repayment.productName] += repayment.totalRepaymentBeforeTds;
  });
  
  return Object.entries(productDistribution).map(([name, value]) => ({ name, value }));
};
