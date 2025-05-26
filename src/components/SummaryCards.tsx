import React from 'react';
import { RepaymentSummary } from '../lib/utils/data-processor';

interface SummaryCardsProps {
  summaryData: RepaymentSummary;
  filteredCount: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summaryData, filteredCount }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Next Month Repayment */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-500">Next Month Repayment</h3>
        <div className="mt-1">
          <div className="text-2xl font-semibold text-gray-800">
            {formatCurrency(summaryData.totalRepaymentNextMonth)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            After TDS: {formatCurrency(summaryData.totalRepaymentNextMonthAfterTds)}
          </div>
        </div>
      </div>

      {/* This Month Repayment */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-500">This Month Repayment</h3>
        <div className="mt-1">
          <div className="text-2xl font-semibold text-gray-800">
            {formatCurrency(summaryData.totalRepaymentThisMonth)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            After TDS: {formatCurrency(summaryData.totalRepaymentThisMonthAfterTds)}
          </div>
        </div>
      </div>

      {/* This Financial Year */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
        <h3 className="text-sm font-medium text-gray-500">This Financial Year</h3>
        <div className="mt-1">
          <div className="text-2xl font-semibold text-gray-800">
            {formatCurrency(summaryData.totalRepaymentThisFinancialYear)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            After TDS: {formatCurrency(summaryData.totalRepaymentThisFinancialYearAfterTds)}
          </div>
        </div>
      </div>

      {/* All Time Repayment */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500">
        <h3 className="text-sm font-medium text-gray-500">All Time Repayment</h3>
        <div className="mt-1">
          <div className="text-2xl font-semibold text-gray-800">
            {formatCurrency(summaryData.totalRepaymentAllTime)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            After TDS: {formatCurrency(summaryData.totalRepaymentAllTimeAfterTds)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
