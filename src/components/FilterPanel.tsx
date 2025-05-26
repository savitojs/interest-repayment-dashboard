import React from 'react';

interface FilterPanelProps {
  filters: {
    product: string;
    entity: string;
    repaymentType: string;
    dateRange: { start: number; end: number };
  };
  uniqueProducts: string[];
  uniqueEntities: string[];
  uniqueRepaymentTypes: string[];
  onFilterChange: (filterName: string, value: string | { start: number; end: number }) => void;
  onResetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  uniqueProducts,
  uniqueEntities,
  uniqueRepaymentTypes,
  onFilterChange,
  onResetFilters
}) => {
  // Handle date range changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = new Date(e.target.value).getTime();
    onFilterChange('dateRange', { 
      start: startDate, 
      end: filters.dateRange.end 
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = new Date(e.target.value).getTime();
    onFilterChange('dateRange', { 
      start: filters.dateRange.start, 
      end: endDate 
    });
  };

  // Format date for input fields
  const formatDateForInput = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
      
      {/* Product Filter */}
      <div className="mb-4">
        <label htmlFor="product-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Product
        </label>
        <select
          id="product-filter"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={filters.product}
          onChange={(e) => onFilterChange('product', e.target.value)}
        >
          <option value="">All Products</option>
          {uniqueProducts.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>
      
      {/* Entity Filter */}
      <div className="mb-4">
        <label htmlFor="entity-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Entity
        </label>
        <select
          id="entity-filter"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={filters.entity}
          onChange={(e) => onFilterChange('entity', e.target.value)}
        >
          <option value="">All Entities</option>
          {uniqueEntities.map((entity) => (
            <option key={entity} value={entity}>
              {entity.charAt(0).toUpperCase() + entity.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Repayment Type Filter */}
      <div className="mb-4">
        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Repayment Type
        </label>
        <select
          id="type-filter"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={filters.repaymentType}
          onChange={(e) => onFilterChange('repaymentType', e.target.value)}
        >
          <option value="">All Types</option>
          {uniqueRepaymentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      
      {/* Date Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date Range
        </label>
        <div className="space-y-2">
          <div>
            <label htmlFor="start-date" className="block text-xs text-gray-500">
              From
            </label>
            <input
              id="start-date"
              type="date"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formatDateForInput(filters.dateRange.start)}
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-xs text-gray-500">
              To
            </label>
            <input
              id="end-date"
              type="date"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formatDateForInput(filters.dateRange.end)}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>
      
      {/* Reset Filters Button */}
      <button
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
        onClick={onResetFilters}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;
