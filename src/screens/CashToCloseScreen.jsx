import React, { useState, useEffect } from 'react';

const CashToCloseScreen = ({ setCurrentView }) => {
  const [homePrice, setHomePrice] = useState(540000);
  const [downPayment, setDownPayment] = useState(108000); // 20% default
  const [downPaymentPct, setDownPaymentPct] = useState(20);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(4)}%`;
  };

  // Calculate loan amount
  const loanAmount = homePrice - downPayment;

  // Calculate closing costs based on percentages of sale price
  const calculateClosingCosts = () => {
    const costs = {
      // I. Loan Costs
      // A. Origination Charges
      points: homePrice * 0.002213,
      underwritingFee: homePrice * 0.002213,
      
      // B. Services You Cannot Shop For
      appraisalFee: homePrice * 0.001074,
      attorneyDocPrepFee: homePrice * 0.000185,
      creditReportFee: homePrice * 0.0001185,
      electronicRegistrationFee: homePrice * 0.0000463,
      floodCertification: homePrice * 0.0000148,
      mortgageInsurancePremium: homePrice * 0.016626,
      
      // C. Services You Can Shop For
      titleCourierFee: homePrice * 0.0000926,
      titleDocPrep: homePrice * 0.000370,
      titleEndorsementFee: homePrice * 0.000376,
      titlePremiumLendersCoverage: homePrice * 0.005665,
      titleRecordingFee: homePrice * 0.000335,
      titleSettlementFee: homePrice * 0.000926,
      titleTaxCertFee: homePrice * 0.000156,
      
      // II. Other Costs
      // E. Taxes and Other Government Fees
      recordingFeesTaxes: homePrice * 0.000337,
      
      // F. Prepaids
      homeownersInsurance12mo: homePrice * 0.01,
      prepaidInterest: homePrice * 0.001459,
      
      // G. Initial Escrow Payment at Closing
      homeownersInsurance3mo: homePrice * 0.003,
      cityPropertyTax3mo: homePrice * 0.004722,
      
      // H. Other
      ownersTitlePolicy: homePrice * 0.000454,
      
      // Lender Credits
      lenderCredits: -(homePrice * 0.001594)
    };

    return costs;
  };

  const costs = calculateClosingCosts();

  // Calculate totals
  const totalLoanCosts = costs.points + costs.underwritingFee + 
                        costs.appraisalFee + costs.attorneyDocPrepFee + 
                        costs.creditReportFee + costs.electronicRegistrationFee + 
                        costs.floodCertification + costs.mortgageInsurancePremium +
                        costs.titleCourierFee + costs.titleDocPrep + 
                        costs.titleEndorsementFee + costs.titlePremiumLendersCoverage +
                        costs.titleRecordingFee + costs.titleSettlementFee + 
                        costs.titleTaxCertFee;

  const totalOtherCosts = costs.recordingFeesTaxes + costs.homeownersInsurance12mo + 
                         costs.prepaidInterest + costs.homeownersInsurance3mo + 
                         costs.cityPropertyTax3mo + costs.ownersTitlePolicy;

  const totalClosingCosts = totalLoanCosts + totalOtherCosts + costs.lenderCredits;
  const totalCashToClose = downPayment + totalClosingCosts;
  const closingCostsPercentage = (totalClosingCosts / homePrice) * 100;

  // Handle down payment changes
  const handleDownPaymentChange = (value) => {
    setDownPayment(value);
    setDownPaymentPct(Math.round((value / homePrice) * 100));
  };

  const handleDownPaymentPctChange = (value) => {
    setDownPaymentPct(value);
    setDownPayment(Math.round((value / 100) * homePrice));
  };

  return (
    <div className="section flex flex-col items-center">
      <h1 className="text-lg md:text-xl font-medium text-slate-600 mb-6 md:mb-8 text-center tracking-wide uppercase">Estimated Cash to Close Calculator</h1>
      
      <div className="card w-full max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center">Calculate Your Closing Costs</h2>
        <p className="mb-4 md:mb-6 text-center text-sm md:text-base">
          Understand all the costs involved in closing on your home.<br />
          <span className="font-semibold">Estimates only - actual costs may vary based on your specific situation.</span>
        </p>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Home Price</label>
            <input 
              type="number" 
              value={homePrice} 
              onChange={e => setHomePrice(Number(e.target.value))} 
              className="input mb-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment</label>
            <input 
              type="number" 
              value={downPayment} 
              onChange={e => handleDownPaymentChange(Number(e.target.value))} 
              className="input mb-2" 
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment %</label>
            <input 
              type="number" 
              value={downPaymentPct} 
              onChange={e => handleDownPaymentPctChange(Number(e.target.value))} 
              className="input" 
            />
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6">
          <h3 className="text-base font-semibold text-slate-800 mb-3 text-center">Cash to Close Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Home Price:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(homePrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Down Payment:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Loan Amount:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(loanAmount)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Closing Costs:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(totalClosingCosts)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Closing Costs %:</span>
                <span className="font-semibold text-slate-800">{formatPercentage(closingCostsPercentage)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 font-semibold">Total Cash to Close:</span>
                <span className="font-semibold text-blue-600 text-base">{formatCurrency(totalCashToClose)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          {/* I. Loan Costs */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-800 mb-3">I. Loan Costs</h4>
            
            {/* A. Origination Charges */}
            <div className="ml-4 mb-3">
              <h5 className="font-medium text-slate-700 mb-2">A. Origination Charges</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Points (% of Loan Amount):</span>
                  <span className="font-medium">{formatCurrency(costs.points)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Underwriting Fee:</span>
                  <span className="font-medium">{formatCurrency(costs.underwritingFee)}</span>
                </div>
              </div>
            </div>

            {/* B. Services You Cannot Shop For */}
            <div className="ml-4 mb-3">
              <h5 className="font-medium text-slate-700 mb-2">B. Services You Cannot Shop For</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Appraisal Fee:</span>
                  <span className="font-medium">{formatCurrency(costs.appraisalFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Attorney Document Preparation:</span>
                  <span className="font-medium">{formatCurrency(costs.attorneyDocPrepFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Credit Report Fee:</span>
                  <span className="font-medium">{formatCurrency(costs.creditReportFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Electronic Registration (MERS):</span>
                  <span className="font-medium">{formatCurrency(costs.electronicRegistrationFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Flood Certification:</span>
                  <span className="font-medium">{formatCurrency(costs.floodCertification)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Mortgage Insurance Premium:</span>
                  <span className="font-medium">{formatCurrency(costs.mortgageInsurancePremium)}</span>
                </div>
              </div>
            </div>

            {/* C. Services You Can Shop For */}
            <div className="ml-4">
              <h5 className="font-medium text-slate-700 mb-2">C. Services You Can Shop For</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Title - Courier/Wire/E-Mail Fee:</span>
                  <span className="font-medium">{formatCurrency(costs.titleCourierFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Title - Document Prep:</span>
                  <span className="font-medium">{formatCurrency(costs.titleDocPrep)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Title - Endorsement Fee:</span>
                  <span className="font-medium">{formatCurrency(costs.titleEndorsementFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Title - Premium for Lender's Coverage:</span>
                  <span className="font-medium">{formatCurrency(costs.titlePremiumLendersCoverage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Title - Recording Fee:</span>
                  <span className="font-medium">{formatCurrency(costs.titleRecordingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Title - Settlement/Closing Fee:</span>
                  <span className="font-medium">{formatCurrency(costs.titleSettlementFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Title - Tax Cert/Guaranty Fee:</span>
                  <span className="font-medium">{formatCurrency(costs.titleTaxCertFee)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* II. Other Costs */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-800 mb-3">II. Other Costs</h4>
            
            {/* E. Taxes and Other Government Fees */}
            <div className="ml-4 mb-3">
              <h5 className="font-medium text-slate-700 mb-2">E. Taxes and Other Government Fees</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Recording Fees and Other Taxes:</span>
                  <span className="font-medium">{formatCurrency(costs.recordingFeesTaxes)}</span>
                </div>
              </div>
            </div>

            {/* F. Prepaids */}
            <div className="ml-4 mb-3">
              <h5 className="font-medium text-slate-700 mb-2">F. Prepaids</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Homeowner's Insurance Premium (12 months):</span>
                  <span className="font-medium">{formatCurrency(costs.homeownersInsurance12mo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Prepaid Interest:</span>
                  <span className="font-medium">{formatCurrency(costs.prepaidInterest)}</span>
                </div>
              </div>
            </div>

            {/* G. Initial Escrow Payment at Closing */}
            <div className="ml-4 mb-3">
              <h5 className="font-medium text-slate-700 mb-2">G. Initial Escrow Payment at Closing</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Homeowner's Insurance (3 months):</span>
                  <span className="font-medium">{formatCurrency(costs.homeownersInsurance3mo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">City Property Tax (3 months):</span>
                  <span className="font-medium">{formatCurrency(costs.cityPropertyTax3mo)}</span>
                </div>
              </div>
            </div>

            {/* H. Other */}
            <div className="ml-4">
              <h5 className="font-medium text-slate-700 mb-2">H. Other</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Title - Owner's Title Policy (Optional):</span>
                  <span className="font-medium">{formatCurrency(costs.ownersTitlePolicy)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lender Credits */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-800 mb-3">Lender Credits</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Lender Credits:</span>
                <span className="font-medium text-green-600">{formatCurrency(costs.lenderCredits)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-6">
          <h4 className="font-semibold text-slate-800 mb-2">Important Disclaimers</h4>
          <ul className="list-disc pl-5 text-xs text-slate-500 space-y-1">
            <li>This calculator provides estimates only and actual costs may vary significantly</li>
            <li>Closing costs vary by location, lender, and loan type</li>
            <li>Some costs may be negotiable or can be shopped for better rates</li>
            <li>Consult with your lender for actual closing cost estimates</li>
            <li>Rates and fees are subject to change based on market conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CashToCloseScreen; 