import React from 'react';
import { Repayment, formatDate, formatCurrency } from '../lib/utils/data-processor';

interface RepaymentTableProps {
  repayments: Repayment[];
  sortConfig: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  onSortChange: (sortBy: string) => void;
}

const RepaymentTable: React.FC<RepaymentTableProps> = ({
  repayments,
  sortConfig,
  onSortChange
}) => {
  // Render sort indicator
  const renderSortIndicator = (columnName: string) => {
    if (sortConfig.sortBy === columnName) {
      return sortConfig.sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return null;
  };

  // Handle sort click
  const handleSortClick = (columnName: string) => {
    onSortChange(columnName);
  };

  // Debug repayments data
  console.log('RepaymentTable received repayments:', repayments);

  // Safely render repayment data with error handling
  const safeRenderRepayments = () => {
    try {
      if (!Array.isArray(repayments) || repayments.length === 0) {
        return (
          <tr>
            <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
              No repayments found matching the current filters.
            </td>
          </tr>
        );
      }

      return repayments.map((repayment, index) => {
        try {
          return (
            <tr key={`repayment-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {repayment.repaymentDate ? formatDate(repayment.repaymentDate) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{repayment.productName || 'Unknown'}</div>
                <div className="text-xs text-gray-500">{repayment.scripCode || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  repayment.repaymentType === 'INTEREST' 
                    ? 'bg-blue-100 text-blue-800' 
                    : repayment.repaymentType === 'PRINCIPAL+INTEREST'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {repayment.repaymentType || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {typeof repayment.totalRepaymentBeforeTds === 'number' 
                  ? formatCurrency(repayment.totalRepaymentBeforeTds) 
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {typeof repayment.tdsValue === 'number' ? formatCurrency(repayment.tdsValue) : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {typeof repayment.tdsPercentage === 'number' ? `${repayment.tdsPercentage}%` : 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {typeof repayment.totalRepaymentAfterTds === 'number' 
                  ? formatCurrency(repayment.totalRepaymentAfterTds) 
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  {repayment.transferredTo && repayment.transferredTo.bankLogo && (
                    <img 
                      src={repayment.transferredTo.bankLogo} 
                      alt="Bank Logo" 
                      className="h-5 w-5 mr-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span>{repayment.transferredTo ? repayment.transferredTo.accountNo : 'N/A'}</span>
                </div>
              </td>
            </tr>
          );
        } catch (error) {
          console.error('Error rendering repayment row:', error, repayment);
          return (
            <tr key={`error-${index}`}>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-red-500">
                Error rendering this repayment.
              </td>
            </tr>
          );
        }
      });
    } catch (error) {
      console.error('Error rendering repayments table:', error);
      return (
        <tr>
          <td colSpan={7} className="px-6 py-4 text-center text-sm text-red-500">
            Error rendering repayments table. Please try again later.
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSortClick('date')}
            >
              Date{renderSortIndicator('date')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSortClick('product')}
            >
              Product{renderSortIndicator('product')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSortClick('amount')}
            >
              Amount{renderSortIndicator('amount')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              TDS
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Net Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Bank Account
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {safeRenderRepayments()}
        </tbody>
      </table>
    </div>
  );
};

export default RepaymentTable;
