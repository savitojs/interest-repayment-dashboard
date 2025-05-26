import React from 'react';
import { 
  Repayment, 
  InvestmentData, 
  formatDate, 
  formatCurrency 
} from '../lib/utils/data-processor';
import FilterPanel from './FilterPanel';
import RepaymentTable from './RepaymentTable';
import SummaryCards from './SummaryCards';
import RepaymentCharts from './RepaymentCharts';

interface DashboardProps {
  data: InvestmentData;
  filteredRepayments: Repayment[];
  filters: {
    product: string;
    entity: string;
    repaymentType: string;
    dateRange: { start: number; end: number };
  };
  sortConfig: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  uniqueProducts: string[];
  uniqueEntities: string[];
  uniqueRepaymentTypes: string[];
  monthlyTotals: { month: string; amount: number }[];
  repaymentTypeDistribution: { name: string; value: number }[];
  productDistribution: { name: string; value: number }[];
  onFilterChange: (filterName: string, value: string | { start: number; end: number }) => void;
  onSortChange: (sortBy: string) => void;
  onResetFilters: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  data,
  filteredRepayments,
  filters,
  sortConfig,
  uniqueProducts,
  uniqueEntities,
  uniqueRepaymentTypes,
  monthlyTotals,
  repaymentTypeDistribution,
  productDistribution,
  onFilterChange,
  onSortChange,
  onResetFilters
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Investment Repayment Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Interactive visualization of upcoming interest repayments
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel - Left Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel 
            filters={filters}
            uniqueProducts={uniqueProducts}
            uniqueEntities={uniqueEntities}
            uniqueRepaymentTypes={uniqueRepaymentTypes}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Summary Cards */}
          <SummaryCards 
            summaryData={data.upcomingRepayments}
            filteredCount={filteredRepayments.length}
          />

          {/* Charts Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Repayment Analytics</h2>
            <RepaymentCharts 
              monthlyTotals={monthlyTotals}
              repaymentTypeDistribution={repaymentTypeDistribution}
              productDistribution={productDistribution}
            />
          </div>

          {/* Repayments Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upcoming Repayments
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredRepayments.length} items)
              </span>
            </h2>
            <RepaymentTable 
              repayments={filteredRepayments}
              sortConfig={sortConfig}
              onSortChange={onSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
