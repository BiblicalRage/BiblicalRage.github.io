import React from 'react';
import MortgageCalculator from '../MortgageCalculator.jsx'; // Adjust path if needed
import RefinanceCalculator from '../RefinanceCalculator.jsx'; // Import the new component

// HomeScreen component receives props from App.jsx
const HomeScreen = ({ 
  showCustomModal, 
  setCurrentView,
  // Mortgage Calculator state
  homePrice, setHomePrice,
  downPayment, setDownPayment,
  downPaymentPct, setDownPaymentPct,
  loanTerm, setLoanTerm,
  interestRate, setInterestRate,
  extraPayment, setExtraPayment,
  mainTaxRate, setMainTaxRate,
  showAdvanced, setShowAdvanced,
  propertyTaxRate, setPropertyTaxRate,
  insuranceRate, setInsuranceRate,
  pmiRate, setPmiRate,
  hoa, setHoa,
  cityTaxRate, setCityTaxRate,
  countyTaxRate, setCountyTaxRate,
  isdTaxRate, setIsdTaxRate,
  collegeTaxRate, setCollegeTaxRate,
  homesteadExemption, setHomesteadExemption,
  showDTI, setShowDTI,
  showDTIGuidelines, setShowDTIGuidelines,
  monthlyIncome, setMonthlyIncome,
  monthlyDebt, setMonthlyDebt,
  housingExpenses, setHousingExpenses,
  otherDebts, setOtherDebts,
  dtiPercentage, setDtiPercentage,
  frontEndDTI, setFrontEndDTI,
  backEndDTI, setBackEndDTI,
  activeTab, setActiveTab,
  showAmortization, setShowAmortization,
  showAllMonths, setShowAllMonths,
  amortizationView, setAmortizationView
}) => {
  const handleSearchForHome = () => {
    window.open('https://portal.onehome.com/en-US/properties/map?searchId=new-search&token=eyJPU04iOiJOVFIiLCJ0eXBlIjoiMSIsInNldGlkIjoiNDY0MjUxNCIsInNldGtleSI6Ijg2MyIsImVtYWlsIjoiamVmZl9sZXZlc3F1ZUByb2NrZXRtYWlsLmNvbSIsInJlc291cmNlaWQiOjAsImFnZW50aWQiOjExMTA3NSwiaXNkZWx0YSI6ZmFsc2UsIlZpZXdNb2RlIjoiMSJ9&defaultId=15152313-7125-3ca8-a011-e28f5cf4bc66', '_blank');
  };

  return (
    <div className="section flex flex-col items-center">
      <h1 className="text-lg md:text-xl font-medium text-slate-600 mb-6 md:mb-8 text-center tracking-wide uppercase">Your Key to Confident Homeownership</h1>
      
      {/* Search for a Home Button */}
      <div className="w-full max-w-4xl mx-auto mb-4 md:mb-6">
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 md:p-4 text-center">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-2">Ready to Find Your Dream Home?</h3>
          <p className="text-slate-600 mb-3 md:mb-4 text-xs md:text-sm">
            Explore available properties in your area with our trusted partner
          </p>
          <button
            onClick={handleSearchForHome}
            className="bg-white text-slate-700 px-4 md:px-6 py-2 rounded-lg font-medium text-sm md:text-base border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
          >
            Search for a Home
          </button>
        </div>
      </div>

      <div className="card w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center">Your Personalized Readiness Report</h2>
        <p className="mb-4 md:mb-6 text-center text-sm md:text-base">
          Input your details below to instantly generate your personalized homebuyer readiness assessment.<br />
          <span style={{ fontWeight: 600 }}>Score based on your self-reported data. Estimates only, not a guarantee of pre-qualification.</span>
        </p>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'basic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Mortgage Calculator
          </button>
          <button
            onClick={() => setActiveTab('refinance')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'refinance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Refinance Calculator
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'basic' && (
          <MortgageCalculator 
            homePrice={homePrice}
            setHomePrice={setHomePrice}
            downPayment={downPayment}
            setDownPayment={setDownPayment}
            downPaymentPct={downPaymentPct}
            setDownPaymentPct={setDownPaymentPct}
            loanTerm={loanTerm}
            setLoanTerm={setLoanTerm}
            interestRate={interestRate}
            setInterestRate={setInterestRate}
            extraPayment={extraPayment}
            setExtraPayment={setExtraPayment}
            mainTaxRate={mainTaxRate}
            setMainTaxRate={setMainTaxRate}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            propertyTaxRate={propertyTaxRate}
            setPropertyTaxRate={setPropertyTaxRate}
            insuranceRate={insuranceRate}
            setInsuranceRate={setInsuranceRate}
            pmiRate={pmiRate}
            setPmiRate={setPmiRate}
            hoa={hoa}
            setHoa={setHoa}
            cityTaxRate={cityTaxRate}
            setCityTaxRate={setCityTaxRate}
            countyTaxRate={countyTaxRate}
            setCountyTaxRate={setCountyTaxRate}
            isdTaxRate={isdTaxRate}
            setIsdTaxRate={setIsdTaxRate}
            collegeTaxRate={collegeTaxRate}
            setCollegeTaxRate={setCollegeTaxRate}
            homesteadExemption={homesteadExemption}
            setHomesteadExemption={setHomesteadExemption}
            showDTI={showDTI}
            setShowDTI={setShowDTI}
            showDTIGuidelines={showDTIGuidelines}
            setShowDTIGuidelines={setShowDTIGuidelines}
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            monthlyDebt={monthlyDebt}
            setMonthlyDebt={setMonthlyDebt}
            housingExpenses={housingExpenses}
            setHousingExpenses={setHousingExpenses}
            otherDebts={otherDebts}
            setOtherDebts={setOtherDebts}
            dtiPercentage={dtiPercentage}
            setDtiPercentage={setDtiPercentage}
            frontEndDTI={frontEndDTI}
            setFrontEndDTI={setFrontEndDTI}
            backEndDTI={backEndDTI}
            setBackEndDTI={setBackEndDTI}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showAmortization={showAmortization}
            setShowAmortization={setShowAmortization}
            showAllMonths={showAllMonths}
            setShowAllMonths={setShowAllMonths}
            amortizationView={amortizationView}
            setAmortizationView={setAmortizationView}
          />
        )}

        {activeTab === 'refinance' && (
          <RefinanceCalculator />
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
