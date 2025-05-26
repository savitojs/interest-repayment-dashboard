import React, { useEffect, useState } from 'react';
import { 
  Repayment, 
  InvestmentData, 
  filterRepayments, 
  sortRepayments, 
  getUniqueProducts, 
  getUniqueEntities, 
  getUniqueRepaymentTypes,
  calculateMonthlyTotals,
  calculateRepaymentTypeDistribution,
  calculateProductDistribution
} from './lib/utils/data-processor';
import Dashboard from './components/Dashboard';

function App() {
  const [data, setData] = useState<InvestmentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredRepayments, setFilteredRepayments] = useState<Repayment[]>([]);
  const [filters, setFilters] = useState({
    product: '',
    entity: '',
    repaymentType: '',
    dateRange: { start: new Date('2025-01-01').getTime(), end: Date.now() + 31536000000 }

  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'date',
    sortOrder: 'asc' as 'asc' | 'desc'
  });
  const [uniqueProducts, setUniqueProducts] = useState<string[]>([]);
  const [uniqueEntities, setUniqueEntities] = useState<string[]>([]);
  const [uniqueRepaymentTypes, setUniqueRepaymentTypes] = useState<string[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState<{ month: string; amount: number }[]>([]);
  const [repaymentTypeDistribution, setRepaymentTypeDistribution] = useState<{ name: string; value: number }[]>([]);
  const [productDistribution, setProductDistribution] = useState<{ name: string; value: number }[]>([]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Attempting to fetch JSON data...');
        
        // Debug: Log all files in public directory
        console.log('Checking for JSON file...');
        
        const response = await fetch('./invest.json');
        console.log('Fetch response:', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        console.log('JSON data loaded:', jsonData);
        
        // Check if data has the expected structure
        if (!jsonData.upcomingRepayments) {
          throw new Error('Invalid data structure: missing upcomingRepayments');
        }
        
        setData(jsonData as InvestmentData);
        setError(null);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load investment data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Process data when loaded
  useEffect(() => {
    if (data) {
      const repayments = data.upcomingRepayments.repaymentsList;
      setUniqueProducts(getUniqueProducts(repayments));
      setUniqueEntities(getUniqueEntities(repayments));
      setUniqueRepaymentTypes(getUniqueRepaymentTypes(repayments));
      
      // Apply initial filtering and sorting
      const filtered = filterRepayments(repayments, filters);
      const sorted = sortRepayments(filtered, sortConfig.sortBy, sortConfig.sortOrder);
      setFilteredRepayments(sorted);
      
      // Calculate chart data
      setMonthlyTotals(calculateMonthlyTotals(sorted));
      setRepaymentTypeDistribution(calculateRepaymentTypeDistribution(sorted));
      setProductDistribution(calculateProductDistribution(sorted));
    }
  }, [data]);

  // Apply filters and sorting when they change
  useEffect(() => {
    if (data) {
      const repayments = data.upcomingRepayments.repaymentsList;
      const filtered = filterRepayments(repayments, filters);
      const sorted = sortRepayments(filtered, sortConfig.sortBy, sortConfig.sortOrder);
      setFilteredRepayments(sorted);
      
      // Recalculate chart data
      setMonthlyTotals(calculateMonthlyTotals(sorted));
      setRepaymentTypeDistribution(calculateRepaymentTypeDistribution(sorted));
      setProductDistribution(calculateProductDistribution(sorted));
    }
  }, [data, filters, sortConfig]);

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string | { start: number; end: number }) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle sort changes
  const handleSortChange = (sortBy: string) => {
    setSortConfig(prev => ({
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      product: '',
      entity: '',
      repaymentType: '',
      dateRange: { start: 0, end: Date.now() + 31536000000 }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-semibold text-gray-700">Loading investment data...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-semibold text-red-600">{error}</div>
        </div>
      ) : data ? (
        <Dashboard 
          data={data}
          filteredRepayments={filteredRepayments}
          filters={filters}
          sortConfig={sortConfig}
          uniqueProducts={uniqueProducts}
          uniqueEntities={uniqueEntities}
          uniqueRepaymentTypes={uniqueRepaymentTypes}
          monthlyTotals={monthlyTotals}
          repaymentTypeDistribution={repaymentTypeDistribution}
          productDistribution={productDistribution}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onResetFilters={resetFilters}
        />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-semibold text-gray-700">No data available</div>
        </div>
      )}
    </div>
  );
}

export default App;
