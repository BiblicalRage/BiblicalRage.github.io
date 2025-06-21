import React from 'react';

const ChevronIcon = ({ expanded }) => (
  <svg
    className={`transition-transform duration-200 ml-2 ${expanded ? 'rotate-180' : ''}`}
    width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ minWidth: 24 }}
  >
    <path d="M8 10l4 4 4-4" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MinimalHeader = ({ title, expanded, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-t-lg focus:outline-none group border-b border-slate-200 hover:bg-slate-50 transition-all duration-200"
    style={{ border: 'none', boxShadow: 'none', fontWeight: 600, fontSize: '1.05rem', color: '#374151' }}
  >
    <span className="text-slate-700 group-hover:text-slate-900 transition-colors duration-200">{title}</span>
    <ChevronIcon expanded={expanded} />
  </button>
);

const MinimalCard = ({ title, expanded, onClick, children }) => (
  <div className="w-full max-w-2xl mx-auto mb-6 rounded-lg shadow-sm bg-white overflow-hidden border border-slate-200 hover:shadow-md transition-all duration-200">
    <MinimalHeader title={title} expanded={expanded} onClick={onClick} />
    <div
      className={`transition-all duration-300 ${expanded ? 'max-h-[4000px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0'}`}
      style={{ overflow: 'hidden' }}
    >
      {expanded && <div className="text-slate-700 text-base leading-relaxed">{children}</div>}
    </div>
  </div>
);

const SectionHeading = ({ children }) => (
  <div className="w-full max-w-2xl mx-auto mb-6">
    <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-1">{children}</h2>
      <div className="w-12 h-0.5 bg-slate-300 rounded-full mx-auto"></div>
    </div>
  </div>
);

const SectionDivider = () => (
  <div className="w-full max-w-2xl mx-auto my-8">
    <div className="flex items-center">
      <div className="flex-1 h-px bg-slate-200"></div>
      <div className="mx-4 w-2 h-2 bg-slate-300 rounded-full"></div>
      <div className="flex-1 h-px bg-slate-200"></div>
    </div>
  </div>
);

const EconomicIndicatorItem = ({ title, source, link, update, description }) => (
  <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200">
    <h4 className="font-semibold text-slate-800 mb-2">{title}</h4>
    <div className="text-sm text-slate-600 space-y-1">
      <p><strong>Source:</strong> {source}</p>
      {link && (
        <p>
          <strong>Link:</strong> 
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline ml-1 transition-colors duration-200"
          >
            View Data
          </a>
        </p>
      )}
      <p><strong>Update Schedule:</strong> {update}</p>
      {description && <p className="mt-2 text-slate-700">{description}</p>}
    </div>
  </div>
);

const Mortgage101Screen = ({
  whatIsMortgageExpanded, setWhatIsMortgageExpanded,
  interestRatesExpanded, setInterestRatesExpanded,
  closingCostsExpanded, setClosingCostsExpanded,
  escrowExpanded, setEscrowExpanded,
  preApprovalExpanded, setPreApprovalExpanded,
  fixedVsAdjustableExpanded, setFixedVsAdjustableExpanded,
  creditExpanded, setCreditExpanded,
  downPaymentExpanded, setDownPaymentExpanded,
  debtReductionExpanded, setDebtReductionExpanded,
  incomeOptimizationExpanded, setIncomeOptimizationExpanded,
  financialFaqExpanded, setFinancialFaqExpanded,
  searchFaqExpanded, setSearchFaqExpanded,
  offerFaqExpanded, setOfferFaqExpanded,
  longTermFaqExpanded, setLongTermFaqExpanded,
  economicIndicatorsExpanded, setEconomicIndicatorsExpanded,
}) => (
  <div className="section flex flex-col items-center">
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-slate-800">
        Mortgage 101
      </h1>
      <div className="w-16 h-0.5 bg-slate-300 rounded-full mx-auto mb-4"></div>
      <p className="max-w-2xl text-slate-600 text-base leading-relaxed">
        Learn the basics of mortgages and home buying.<br />
        <span className="text-slate-700 font-medium">Your journey to homeownership starts here.</span>
      </p>
    </div>

    {/* Key Economic Indicators & Market Data */}
    <SectionHeading>Factors That Affect Interest Rates</SectionHeading>
    <MinimalCard title="Economic Indicators & Where to Find Their Updates" expanded={economicIndicatorsExpanded} onClick={() => setEconomicIndicatorsExpanded(!economicIndicatorsExpanded)}>
      <div className="space-y-4">
        <p className="text-slate-700 mb-4">
          Understanding key economic indicators can help you make informed decisions about when to buy a home. Here are the most important indicators and where to find current data:
        </p>
        
        <h4 className="font-semibold text-slate-800 text-lg mb-3">Inflation Data</h4>
        <EconomicIndicatorItem
          title="Consumer Price Index (CPI)"
          source="U.S. Bureau of Labor Statistics (BLS)"
          link="https://www.bls.gov/cpi/"
          update="Typically released between the 10th and 13th of each month, at 8:30 AM ET, covering data for the previous month."
          description="Measures changes in the price level of a basket of consumer goods and services purchased by households."
        />
        <EconomicIndicatorItem
          title="Personal Consumption Expenditures (PCE) Price Index"
          source="U.S. Bureau of Economic Analysis (BEA)"
          link="https://www.bea.gov/data/personal-consumption-expenditures-price-index"
          update="Generally released towards the end of each month, at 8:30 AM ET, covering data from the previous month."
          description="The Federal Reserve's preferred measure of inflation, considered more comprehensive than CPI."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Federal Reserve Policy</h4>
        <EconomicIndicatorItem
          title="Federal Reserve Policy & Commentary"
          source="Board of Governors of the Federal Reserve System"
          link="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"
          update="FOMC meetings occur 8 times per year (approximately every 6-8 weeks). Statements are released immediately after meetings, minutes are released ~3 weeks later."
          description="Federal Reserve decisions directly impact mortgage rates through changes in the federal funds rate."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Treasury Yields</h4>
        <EconomicIndicatorItem
          title="U.S. Treasury Yields (10-year Treasury Note)"
          source="U.S. Department of the Treasury"
          link="https://www.treasury.gov/resource-center/data-chart-center/interest-rates/pages/textview.aspx?data=yield"
          update="Daily on business days, typically updated by 3:30 PM ET."
          description="The 10-year Treasury yield is closely correlated with 30-year fixed mortgage rates."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Jobs & Labor Market</h4>
        <EconomicIndicatorItem
          title="Jobs & Labor Market Reports (Non-Farm Payrolls, Unemployment Rate, Wage Growth)"
          source="U.S. Bureau of Labor Statistics (BLS) - 'The Employment Situation'"
          link="https://www.bls.gov/news.release/empsit.nr0.htm"
          update="Released on the first Friday of each month, at 8:30 AM ET, detailing the jobs and unemployment situation for the prior month."
          description="Strong employment data can lead to higher mortgage rates as it suggests economic strength and potential inflation."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Consumer Confidence & Spending</h4>
        <EconomicIndicatorItem
          title="Consumer Confidence Index"
          source="The Conference Board"
          link="https://www.conference-board.org/topics/consumer-confidence"
          update="Typically released towards the end of each month, at 10:00 AM ET."
          description="Measures consumer sentiment about current and future economic conditions, which can influence housing demand."
        />
        <EconomicIndicatorItem
          title="Retail Sales"
          source="U.S. Census Bureau"
          link="https://www.census.gov/retail/index.html"
          update="Released around the middle of each month (around the 15th to the 18th), at 8:30 AM ET, reporting on sales from the previous month."
          description="Indicates consumer spending strength, which affects overall economic health and mortgage rates."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Manufacturing & Services</h4>
        <EconomicIndicatorItem
          title="ISM Manufacturing PMI & ISM Services PMI"
          source="Institute for Supply Management (ISM)"
          link="https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/"
          update="ISM Manufacturing PMI on the first business day of each month; ISM Services PMI on the third business day of each month. Both at 10:00 AM ET."
          description="Measures economic activity in manufacturing and services sectors, with readings above 50 indicating expansion."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Housing Market Data</h4>
        <EconomicIndicatorItem
          title="Housing Starts & Building Permits"
          source="U.S. Census Bureau (New Residential Construction)"
          link="https://www.census.gov/construction/nrc/"
          update="Released around the middle of each month (typically between the 16th and 19th), at 8:30 AM ET, for the prior month's activity."
          description="Indicates future housing supply and construction activity, which affects home prices and availability."
        />
        <EconomicIndicatorItem
          title="Existing Home Sales"
          source="National Association of Realtors (NAR)"
          link="https://www.nar.realtor/research-and-statistics/research-reports/existing-home-sales"
          update="Typically comes out around the 20th to 24th of each month, at 10:00 AM ET, covering sales from the previous month."
          description="Shows current housing market activity and can indicate market strength or weakness."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Commodity Prices</h4>
        <EconomicIndicatorItem
          title="Oil Prices & Energy Data"
          source="U.S. Energy Information Administration (EIA)"
          link="https://www.eia.gov/petroleum/"
          update="Daily during market trading hours. EIA reports often weekly or monthly depending on the specific data."
          description="Energy prices can influence inflation expectations and overall economic activity."
        />

        <h4 className="font-semibold text-slate-800 text-lg mb-3 mt-6">Yield Curve</h4>
        <EconomicIndicatorItem
          title="Yield Curve Shape"
          source="U.S. Department of the Treasury"
          link="https://www.treasury.gov/resource-center/data-chart-center/interest-rates/pages/textview.aspx?data=yield"
          update="Effectively daily, based on the underlying Treasury yield data."
          description="The relationship between short-term and long-term interest rates can indicate economic expectations and potential recession risks."
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h5>
          <p className="text-blue-700 text-sm">
            Set up calendar reminders for key economic releases, especially the jobs report (first Friday of each month) and Federal Reserve meetings. 
            These events often cause significant movements in mortgage rates.
          </p>
        </div>
      </div>
    </MinimalCard>

    <SectionDivider />

    {/* First-Time Homebuyer Questions (FAQ) */}
    <SectionHeading>First-Time Homebuyer Questions (FAQ)</SectionHeading>
    <MinimalCard title="Financial & Loan Questions" expanded={financialFaqExpanded} onClick={() => setFinancialFaqExpanded(!financialFaqExpanded)}>
      Common questions about preparing financially for homeownership, including saving for down payments, improving credit scores, and managing debt.
    </MinimalCard>
    <MinimalCard title="The Search Process" expanded={searchFaqExpanded} onClick={() => setSearchFaqExpanded(!searchFaqExpanded)}>
      Questions about finding the right home, working with real estate agents, and understanding different types of properties.
    </MinimalCard>
    <MinimalCard title="Making an Offer & Beyond" expanded={offerFaqExpanded} onClick={() => setOfferFaqExpanded(!offerFaqExpanded)}>
      Information about making offers, negotiating prices, and understanding the terms of your purchase agreement.
    </MinimalCard>
    <MinimalCard title="Long-Term Ownership" expanded={longTermFaqExpanded} onClick={() => setLongTermFaqExpanded(!longTermFaqExpanded)}>
      Questions about maintaining your home, refinancing options, and planning for future housing needs.
    </MinimalCard>

    <SectionDivider />

    {/* Mortgage Basics */}
    <SectionHeading>Mortgage Basics</SectionHeading>
    <MinimalCard title="What is a Mortgage? (The Basics)" expanded={whatIsMortgageExpanded} onClick={() => setWhatIsMortgageExpanded(!whatIsMortgageExpanded)}>
      A mortgage is a loan used to purchase a home. The home itself serves as collateral for the loan. Mortgages typically have terms of 15 to 30 years, and the interest rate can be fixed or adjustable.
    </MinimalCard>
    <MinimalCard title="Interest Rates Explained (Your Cost of Borrowing)" expanded={interestRatesExpanded} onClick={() => setInterestRatesExpanded(!interestRatesExpanded)}>
      The interest rate is the percentage charged by the lender for the money you borrow. It greatly influences your monthly payment and the total amount you'll pay over the life of the loan.
    </MinimalCard>
    <MinimalCard title="Understanding Closing Costs (The Hidden Fees)" expanded={closingCostsExpanded} onClick={() => setClosingCostsExpanded(!closingCostsExpanded)}>
      Closing costs are fees and expenses paid at the closing of a real estate transaction, beyond the purchase price of the property and your down payment. They typically range from 2% to 5% of the loan amount.
    </MinimalCard>
    <MinimalCard title="What is Escrow? (Handling Your Property Bills)" expanded={escrowExpanded} onClick={() => setEscrowExpanded(!escrowExpanded)}>
      Escrow is a neutral third party that holds funds and documents during the home buying process. It ensures that all conditions of the sale are met before the transaction is completed.
    </MinimalCard>
    <MinimalCard title="The Importance of Pre-Approval (Your Buying Power)" expanded={preApprovalExpanded} onClick={() => setPreApprovalExpanded(!preApprovalExpanded)}>
      Pre-approval is a preliminary evaluation by a lender that determines how much you can borrow. It's a crucial first step in the home buying process.
    </MinimalCard>
    <MinimalCard title="Fixed vs. Adjustable Rate Mortgages (Predictability vs. Flexibility)" expanded={fixedVsAdjustableExpanded} onClick={() => setFixedVsAdjustableExpanded(!fixedVsAdjustableExpanded)}>
      Fixed-rate mortgages have the same interest rate for the entire loan term. Adjustable-rate mortgages (ARMs) have rates that can change periodically. Fixed rates offer stability, while ARMs may start with lower rates.
    </MinimalCard>

    <SectionDivider />

    {/* Guided Readiness Paths & Strategies */}
    <SectionHeading>Guided Readiness Paths & Strategies</SectionHeading>
    <MinimalCard title="Credit Improvement" expanded={creditExpanded} onClick={() => setCreditExpanded(!creditExpanded)}>
      Your credit score is a key factor in mortgage approval. Focus on paying bills on time, keeping credit utilization low, and checking your credit report regularly.
    </MinimalCard>
    <MinimalCard title="Down Payment Savings" expanded={downPaymentExpanded} onClick={() => setDownPaymentExpanded(!downPaymentExpanded)}>
      A strong down payment can lead to better loan terms and lower monthly payments. Set a realistic goal and automate your savings.
    </MinimalCard>
    <MinimalCard title="Debt Reduction" expanded={debtReductionExpanded} onClick={() => setDebtReductionExpanded(!debtReductionExpanded)}>
      Reducing your existing debt is crucial for improving your debt-to-income ratio (DTI), a key metric lenders use.
    </MinimalCard>
    <MinimalCard title="Income Optimization" expanded={incomeOptimizationExpanded} onClick={() => setIncomeOptimizationExpanded(!incomeOptimizationExpanded)}>
      Lenders need clear, consistent proof of income. Maintain good records and consider ways to increase your income.
    </MinimalCard>
  </div>
);

export default Mortgage101Screen;
