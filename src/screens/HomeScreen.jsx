import React from 'react';
import MortgageCalculator from '../MortgageCalculator.jsx'; // Adjust path if needed

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
  monthlyIncome, setMonthlyIncome,
  monthlyDebt, setMonthlyDebt,
  housingExpenses, setHousingExpenses,
  otherDebts, setOtherDebts,
  dtiPercentage, setDtiPercentage,
  frontEndDTI, setFrontEndDTI,
  backEndDTI, setBackEndDTI,
  activeTab, setActiveTab,
  showAmortization, setShowAmortization,
  showAllMonths, setShowAllMonths
}) => {
  const handleSearchForHome = () => {
    window.open('https://portal.onehome.com/en-US/properties/map?searchId=new-search&token=eyJPU04iOiJOVFIiLCJ0eXBlIjoiMSIsInNldGlkIjoiNDY0MjUxNCIsInNldGtleSI6Ijg2MyIsImVtYWlsIjoiamVmZl9sZXZlc3F1ZUByb2NrZXRtYWlsLmNvbSIsInJlc291cmNlaWQiOjAsImFnZW50aWQiOjExMTA3NSwiaXNkZWx0YSI6ZmFsc2UsIlZpZXdNb2RlIjoiMSJ9&defaultId=15152313-7125-3ca8-a011-e28f5cf4bc66', '_blank');
  };

  return (
    <div className="section flex flex-col items-center">
      <h1 className="text-xl font-medium text-slate-600 mb-8 text-center tracking-wide uppercase">Your Key to Confident Homeownership</h1>
      
      {/* Search for a Home Button */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to Find Your Dream Home?</h3>
          <p className="text-slate-600 mb-4 text-sm">
            Explore available properties in your area with our trusted partner
          </p>
          <button
            onClick={handleSearchForHome}
            className="bg-white text-slate-700 px-6 py-2 rounded-lg font-medium text-base border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
          >
            Search for a Home
          </button>
        </div>
      </div>

      <div className="card w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Personalized Readiness Report</h2>
        <p className="mb-6 text-center">
          Input your details below to instantly generate your personalized homebuyer readiness assessment.<br />
          <span style={{ fontWeight: 600 }}>Score based on your self-reported data. Estimates only, not a guarantee of pre-approval.</span>
        </p>
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
        />
      </div>
    </div>
  );
};

export default HomeScreen;
