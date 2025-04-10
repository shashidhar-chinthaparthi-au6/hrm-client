// TaxDeductions.jsx
import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Select from '../common/Select';

const TaxDeductions = () => {
  const [taxableIncome, setTaxableIncome] = useState(75000);
  const [taxCategory, setTaxCategory] = useState('standardDeduction');
  const [additionalDeductions, setAdditionalDeductions] = useState(7500);
  const [taxRegime, setTaxRegime] = useState('old');
  
  const taxRegimeOptions = [
    { value: 'old', label: 'Old Tax Regime' },
    { value: 'new', label: 'New Tax Regime' }
  ];
  
  const taxCategoryOptions = [
    { value: 'standardDeduction', label: 'Standard Deduction' },
    { value: 'section80C', label: 'Section 80C' },
    { value: 'housingLoan', label: 'Housing Loan Interest' },
    { value: 'medicalInsurance', label: 'Medical Insurance Premium' },
    { value: 'nps', label: 'National Pension Scheme' }
  ];

  // Example tax slabs (simplified for demonstration)
  const taxSlabs = {
    old: [
      { upto: 250000, rate: 0 },
      { upto: 500000, rate: 5 },
      { upto: 750000, rate: 10 },
      { upto: 1000000, rate: 15 },
      { upto: 1250000, rate: 20 },
      { upto: 1500000, rate: 25 },
      { upto: Infinity, rate: 30 }
    ],
    new: [
      { upto: 300000, rate: 0 },
      { upto: 600000, rate: 5 },
      { upto: 900000, rate: 10 },
      { upto: 1200000, rate: 15 },
      { upto: 1500000, rate: 20 },
      { upto: Infinity, rate: 25 }
    ]
  };

  const calculateTax = () => {
    const slabs = taxSlabs[taxRegime];
    let income = taxableIncome;
    
    // Apply deductions in old regime only
    if (taxRegime === 'old') {
      income = Math.max(0, income - additionalDeductions);
    }
    
    let remainingIncome = income;
    let totalTax = 0;
    
    // Calculate tax based on slabs
    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];
      const prevLimit = i === 0 ? 0 : slabs[i-1].upto;
      const slabAmount = Math.min(remainingIncome, slab.upto - prevLimit);
      
      if (slabAmount <= 0) break;
      
      const taxForSlab = (slabAmount * slab.rate) / 100;
      totalTax += taxForSlab;
      remainingIncome -= slabAmount;
    }
    
    // Add education cess (4%)
    totalTax += totalTax * 0.04;
    
    return Math.round(totalTax);
  };

  const tax = calculateTax();
  const netPayAfterTax = taxableIncome - tax;
  const effectiveTaxRate = ((tax / taxableIncome) * 100).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Tax Deduction Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Regime</label>
            <Select 
              options={taxRegimeOptions}
              value={taxRegime}
              onChange={(e) => setTaxRegime(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Taxable Income</label>
            <Input 
              type="number"
              value={taxableIncome}
              onChange={(e) => setTaxableIncome(Number(e.target.value))}
              prefix="$"
            />
          </div>
          
          {taxRegime === 'old' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deduction Category</label>
                <Select 
                  options={taxCategoryOptions}
                  value={taxCategory}
                  onChange={(e) => setTaxCategory(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deduction Amount</label>
                <Input 
                  type="number"
                  value={additionalDeductions}
                  onChange={(e) => setAdditionalDeductions(Number(e.target.value))}
                  prefix="$"
                />
              </div>
              
              <Button 
                label="Calculate Tax"
                primary
                className="mt-2"
                onClick={() => {}} // Tax is already calculated reactively
              />
            </>
          )}
        </div>
        
        <div>
          <Card className="bg-gray-50 p-4">
            <h3 className="text-lg font-medium mb-4">Tax Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Annual Income:</span>
                <span className="font-medium">${taxableIncome.toLocaleString()}</span>
              </div>
              
              {taxRegime === 'old' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deductions:</span>
                  <span className="font-medium">${additionalDeductions.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable Income:</span>
                <span className="font-medium">
                  ${(taxRegime === 'old' ? taxableIncome - additionalDeductions : taxableIncome).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Estimated Tax Amount:</span>
                <span className="font-semibold text-red-600">${tax.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Net Pay After Tax:</span>
                <span className="font-semibold text-green-600">${netPayAfterTax.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Effective Tax Rate:</span>
                <span className="font-medium">{effectiveTaxRate}%</span>
              </div>
            </div>
          </Card>
          
          <div className="mt-4">
            <Button 
              label="Download Tax Projection"
              secondary
              fullWidth
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-md text-sm">
        <h4 className="font-medium text-blue-700 mb-2">Tax Saving Tips</h4>
        <ul className="list-disc list-inside space-y-1 text-blue-600">
          <li>Maximize your 401(k) contributions</li>
          <li>Consider Health Savings Account (HSA) contributions</li>
          <li>Track and claim all eligible business expenses</li>
          <li>Invest in tax-advantaged retirement accounts</li>
          <li>Consult with a tax professional for personalized advice</li>
        </ul>
      </div>
    </div>
  );
};

export default TaxDeductions;