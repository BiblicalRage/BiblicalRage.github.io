import React, { useState, Component } from 'react';
import firstKeyLogo from './assets/FirstKey.png';
import HomeScreen from './screens/HomeScreen.jsx';
import DocumentsScreen from './screens/DocumentsScreen.jsx';
import ConnectScreen from './screens/ConnectScreen.jsx';
import Mortgage101Screen from './screens/Mortgage101Screen.jsx';
import AuthScreen from './screens/AuthScreen.jsx';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Custom Modal Component for better user feedback
const CustomModal = ({ visible, message, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 m-5 max-w-sm w-full flex flex-col items-center">
        <p className="mb-6 text-center text-slate-700 text-base">{message}</p>
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl py-2 font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const App = () => {
  // Navigation state
  const [currentView, setCurrentView] = useState('home');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Document management state
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documentConsent, setDocumentConsent] = useState({});

  // Connect screen state
  const [userZipCode, setUserZipCode] = useState('');
  const [selectedProfessionalType, setSelectedProfessionalType] = useState(null);
  const [shareDocumentsWithLender, setShareDocumentsWithLender] = useState(false);
  const [consentToEmailDocuments, setConsentToEmailDocuments] = useState(false);
  const [optionalMessage, setOptionalMessage] = useState('');

  // Mortgage Calculator state (lifted up to persist across tabs)
  const [homePrice, setHomePrice] = useState(330000);
  const [downPayment, setDownPayment] = useState(66000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [extraPayment, setExtraPayment] = useState(0);
  const [mainTaxRate, setMainTaxRate] = useState(0.500780 + 0.3051 + 0.1467 + 1.1799);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.8);
  const [insuranceRate, setInsuranceRate] = useState(0.5);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [hoa, setHoa] = useState(0);
  const [cityTaxRate, setCityTaxRate] = useState(0.500780);
  const [countyTaxRate, setCountyTaxRate] = useState(0.3051);
  const [isdTaxRate, setIsdTaxRate] = useState(1.1799);
  const [collegeTaxRate, setCollegeTaxRate] = useState(0.1467);
  const [homesteadExemption, setHomesteadExemption] = useState(100000);
  const [showDTI, setShowDTI] = useState(false);
  const [showDTIGuidelines, setShowDTIGuidelines] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(6500);
  const [monthlyDebt, setMonthlyDebt] = useState(500);
  const [housingExpenses, setHousingExpenses] = useState(0);
  const [otherDebts, setOtherDebts] = useState(500);
  const [dtiPercentage, setDtiPercentage] = useState(10);
  const [frontEndDTI, setFrontEndDTI] = useState(0);
  const [backEndDTI, setBackEndDTI] = useState(10);
  const [activeTab, setActiveTab] = useState('breakdown');
  const [showAmortization, setShowAmortization] = useState(false);
  const [showAllMonths, setShowAllMonths] = useState(false);
  const [amortizationView, setAmortizationView] = useState('graph'); // 'graph' or 'table'

  // Mortgage101 expand/collapse state
  const [whatIsMortgageExpanded, setWhatIsMortgageExpanded] = useState(false);
  const [interestRatesExpanded, setInterestRatesExpanded] = useState(false);
  const [closingCostsExpanded, setClosingCostsExpanded] = useState(false);
  const [escrowExpanded, setEscrowExpanded] = useState(false);
  const [preApprovalExpanded, setPreApprovalExpanded] = useState(false);
  const [fixedVsAdjustableExpanded, setFixedVsAdjustableExpanded] = useState(false);
  const [creditExpanded, setCreditExpanded] = useState(false);
  const [downPaymentExpanded, setDownPaymentExpanded] = useState(false);
  const [debtReductionExpanded, setDebtReductionExpanded] = useState(false);
  const [incomeOptimizationExpanded, setIncomeOptimizationExpanded] = useState(false);
  const [financialFaqExpanded, setFinancialFaqExpanded] = useState(false);
  const [searchFaqExpanded, setSearchFaqExpanded] = useState(false);
  const [offerFaqExpanded, setOfferFaqExpanded] = useState(false);
  const [longTermFaqExpanded, setLongTermFaqExpanded] = useState(false);
  const [economicIndicatorsExpanded, setEconomicIndicatorsExpanded] = useState(false);

  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [onAuthSuccessCallback, setOnAuthSuccessCallback] = useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Helper to open Auth modal and run a callback after login
  const requireLogin = (callback) => {
    setOnAuthSuccessCallback(() => callback);
    setShowAuthModal(true);
  };

  // When login is successful, close modal and run callback if provided
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setUser(auth.currentUser);
    if (onAuthSuccessCallback) {
      onAuthSuccessCallback();
      setOnAuthSuccessCallback(null);
    }
  };

  // Always reset selectedProfessionalType when leaving Connect screen
  React.useEffect(() => {
    if (currentView !== 'connect') {
      setSelectedProfessionalType(null);
    }
  }, [currentView]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show modal helper
  const showCustomModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Document upload handlers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      name: file.name,
      size: file.size,
      category: determineDocumentCategory(file.name),
      content: `This is simulated content for document: ${file.name}. Real content would be here.`
    }));
    setUploadedDocuments(prev => [...prev, ...newDocs]);
    e.target.value = null;
  };

  const determineDocumentCategory = (fileName) => {
    const lowerFileName = fileName.toLowerCase();
    if (lowerFileName.includes('id') || lowerFileName.includes('passport') || lowerFileName.includes('license')) {
      return 'PERSONAL';
    } else if (lowerFileName.includes('pay') || lowerFileName.includes('w2') || lowerFileName.includes('tax')) {
      return 'INCOME';
    } else if (lowerFileName.includes('bank') || lowerFileName.includes('statement') || lowerFileName.includes('investment')) {
      return 'ASSETS';
    } else if (lowerFileName.includes('credit') || lowerFileName.includes('debt') || lowerFileName.includes('loan')) {
      return 'DEBTS';
    } else if (lowerFileName.includes('property') || lowerFileName.includes('home') || lowerFileName.includes('insurance')) {
      return 'PROPERTY';
    }
    return 'PERSONAL'; // Default category
  };

  const handleRemoveDocument = (fileName) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.name !== fileName));
    // Remove consent when document is removed
    setDocumentConsent(prev => {
      const newConsent = { ...prev };
      delete newConsent[fileName];
      return newConsent;
    });
  };

  const handleDownloadDocuments = async () => {
    if (uploadedDocuments.length === 0) {
      showCustomModal("No documents uploaded to download.");
      return;
    }
    setIsLoading(true);
    try {
      const JSZip = (await import('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')).default;
      const zip = new JSZip();

      // Only include documents that have consent
      const documentsToInclude = uploadedDocuments.filter(doc => documentConsent[doc.name]);
      
      if (documentsToInclude.length === 0) {
        showCustomModal("No documents have sharing consent enabled. Please enable sharing for documents you want to include.");
        setIsLoading(false);
        return;
      }

      documentsToInclude.forEach(doc => {
        zip.file(doc.name, doc.content);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FirstKey_My_Documents.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showCustomModal("Your documents have been downloaded as a zip file.");
    } catch (error) {
      console.error("Error zipping or downloading documents:", error);
      showCustomModal("Failed to download documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Connect screen handlers
  const handleProfessionalZipCodeSubmit = async () => {
    if (!userZipCode || userZipCode.length !== 5 || isNaN(parseInt(userZipCode))) {
      showCustomModal('Please enter a valid 5-digit zip code to find professionals.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
        showCustomModal(`Searching for ${selectedProfessionalType === 'lender' ? 'lenders' : 'realtors'} in ${userZipCode}. Scroll down to see results.`);
        setIsLoading(false);
    }, 1000);
  };
  const sendConnectionEmail = async (professionalName) => {
    setIsLoading(true);
    let emailContent = `Connection request from FirstKey user.\n\n`;
    emailContent += `Homebuyer Progress Details (from Calculator - simulated data):\n`;
    emailContent += `- Estimated Monthly Income: $${1234.56}\n`;
    emailContent += `- Estimated Total Monthly Debt: $${789.01}\n`;
    emailContent += `- Estimated Desired Home Price: $${250000.00}\n`;
    if (optionalMessage) {
      emailContent += `\nUser's Personalized Message:\n"${optionalMessage}"\n`;
    }
    let attachmentStatus = "No documents were attached.";
    if (shareDocumentsWithLender && consentToEmailDocuments && uploadedDocuments.length > 0) {
      attachmentStatus = `A compiled zip file containing ${uploadedDocuments.length} document(s) is being prepared and will be attached.`;
    } else if (shareDocumentsWithLender && !consentToEmailDocuments) {
        attachmentStatus = "Documents were NOT attached as explicit consent for email sharing was not given.";
    }
    setTimeout(() => {
      showCustomModal(`Connection email sent to ${professionalName}! They will contact you directly soon. ${attachmentStatus}`);
      setIsLoading(false);
      setShareDocumentsWithLender(false);
      setConsentToEmailDocuments(false);
      setOptionalMessage('');
    }, 2000);
  };

  // ExpandableSection dummy for Mortgage101Screen (replace with your real one if needed)
  const ExpandableSection = () => null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col font-sans">
      <CustomModal
        visible={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
      
      {/* Enhanced Header */}
      <header className="w-full bg-white py-4 md:py-8 px-3 md:px-5 shadow-lg">
        <div className="max-w-7xl w-full mx-auto" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <img
              src={firstKeyLogo}
              alt="FirstKey Logo"
              style={{ width: 80, height: 120, objectFit: 'contain', minWidth: 80, display: 'block', margin: '0 auto' }}
              className="md:w-[110px] md:h-[160px] md:min-w-[110px]"
            />
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: 0,
              marginTop: 8,
              color: '#222',
              textShadow: '0 2px 8px rgba(30,41,59,0.10)'
            }}
            className="md:text-[2.5rem] md:mt-3">
              <span style={{ color: '#222' }}>First</span>
              <span style={{
                background: 'linear-gradient(90deg, #80dac1 0%, #5cb0ec 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
                marginLeft: 4
              }}>Key</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 shadow-sm flex justify-center bg-white/95 backdrop-blur-sm">
        <div className="w-full px-2 md:px-4 flex justify-center">
          <div
            className="flex flex-row justify-center items-center py-3 md:py-3 gap-2 md:gap-3"
            style={{
              whiteSpace: 'nowrap',
              overflowX: 'auto',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              maxWidth: '100%',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
            }}
          >
            {[
              { 
                key: 'home', 
                label: 'Home',
                icon: (
                  <svg className="w-8 h-8 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )
              },
              { 
                key: 'documents', 
                label: 'Documents Required',
                icon: (
                  <svg className="w-8 h-8 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              { 
                key: 'mortgage101', 
                label: 'Mortgage 101',
                icon: (
                  <svg className="w-8 h-8 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )
              },
              { 
                key: 'connect', 
                label: 'Connect',
                icon: (
                  <svg className="w-8 h-8 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
            ].map((tab, index) => (
              <button
                key={tab.key}
                className={`transition duration-200 font-semibold text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-none flex items-center justify-center relative md:rounded-[18px] md:px-[0.55em] md:py-[0.55em] md:text-[1.05rem]`
                  + (currentView === tab.key ? ' z-10 scale-105' : ' opacity-90 hover:opacity-100')
                }
                style={{
                  borderRadius: '14px',
                  padding: '0.6em 1.2em',
                  background: 'linear-gradient(90deg, #80dac1 0%, #5cb0ec 100%)',
                  color: '#fff',
                  boxShadow: currentView === tab.key ? '0 2px 8px 0 rgba(0,0,0,0.08)' : 'none',
                  margin: 0,
                  border: '1.5px solid #000',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'transform 0.15s',
                  whiteSpace: 'nowrap',
                  minHeight: '48px',
                  minWidth: '48px',
                }}
                onClick={() => setCurrentView(tab.key)}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-3 md:px-4 py-4 md:py-6">
        {currentView === 'home' && (
          <HomeScreen
            showCustomModal={showCustomModal}
            setCurrentView={setCurrentView}
            // Mortgage Calculator state
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
        {currentView === 'documents' && (
          <DocumentsScreen
            uploadedDocuments={uploadedDocuments}
            handleFileUpload={handleFileUpload}
            handleRemoveDocument={handleRemoveDocument}
            handleDownloadDocuments={handleDownloadDocuments}
            isLoading={isLoading}
            documentConsent={documentConsent}
            setDocumentConsent={setDocumentConsent}
            setCurrentView={setCurrentView}
            user={user}
            requireLogin={requireLogin}
          />
        )}
        {currentView === 'mortgage101' && (
          <Mortgage101Screen
            whatIsMortgageExpanded={whatIsMortgageExpanded}
            setWhatIsMortgageExpanded={setWhatIsMortgageExpanded}
            interestRatesExpanded={interestRatesExpanded}
            setInterestRatesExpanded={setInterestRatesExpanded}
            closingCostsExpanded={closingCostsExpanded}
            setClosingCostsExpanded={setClosingCostsExpanded}
            escrowExpanded={escrowExpanded}
            setEscrowExpanded={setEscrowExpanded}
            preApprovalExpanded={preApprovalExpanded}
            setPreApprovalExpanded={setPreApprovalExpanded}
            fixedVsAdjustableExpanded={fixedVsAdjustableExpanded}
            setFixedVsAdjustableExpanded={setFixedVsAdjustableExpanded}
            creditExpanded={creditExpanded}
            setCreditExpanded={setCreditExpanded}
            downPaymentExpanded={downPaymentExpanded}
            setDownPaymentExpanded={setDownPaymentExpanded}
            debtReductionExpanded={debtReductionExpanded}
            setDebtReductionExpanded={setDebtReductionExpanded}
            incomeOptimizationExpanded={incomeOptimizationExpanded}
            setIncomeOptimizationExpanded={setIncomeOptimizationExpanded}
            financialFaqExpanded={financialFaqExpanded}
            setFinancialFaqExpanded={setFinancialFaqExpanded}
            searchFaqExpanded={searchFaqExpanded}
            setSearchFaqExpanded={setSearchFaqExpanded}
            offerFaqExpanded={offerFaqExpanded}
            setOfferFaqExpanded={setOfferFaqExpanded}
            longTermFaqExpanded={longTermFaqExpanded}
            setLongTermFaqExpanded={setLongTermFaqExpanded}
            economicIndicatorsExpanded={economicIndicatorsExpanded}
            setEconomicIndicatorsExpanded={setEconomicIndicatorsExpanded}
            ExpandableSection={ExpandableSection}
          />
        )}
        {currentView === 'connect' && (
          <ConnectScreen
            selectedProfessionalType={selectedProfessionalType}
            setSelectedProfessionalType={setSelectedProfessionalType}
            userZipCode={userZipCode}
            setUserZipCode={setUserZipCode}
            handleProfessionalZipCodeSubmit={handleProfessionalZipCodeSubmit}
            isLoading={isLoading}
            uploadedDocuments={uploadedDocuments}
            shareDocumentsWithLender={shareDocumentsWithLender}
            setShareDocumentsWithLender={setShareDocumentsWithLender}
            consentToEmailDocuments={consentToEmailDocuments}
            setConsentToEmailDocuments={setConsentToEmailDocuments}
            optionalMessage={optionalMessage}
            setOptionalMessage={setOptionalMessage}
            handleDownloadDocuments={handleDownloadDocuments}
            sendConnectionEmail={sendConnectionEmail}
          />
        )}
      </main>

      {/* Footer */}
      <div className="border-t border-slate-200 w-full my-0"></div>
      <footer className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
          <p className="mb-2">© 2024 FirstKey. All rights reserved.</p>
          <p className="mt-2 text-slate-400 text-base font-medium">Your trusted partner in homeownership</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-0 m-5 max-w-sm w-full flex flex-col items-center">
            <AuthScreen onAuthSuccess={handleAuthSuccess} />
            <button className="text-blue-600 hover:underline text-sm mb-4" onClick={() => setShowAuthModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
