import React from 'react';

// ConnectScreen component receives props from App.jsx
const ConnectScreen = ({
  selectedProfessionalType,
  setSelectedProfessionalType,
  userZipCode,
  setUserZipCode,
  handleProfessionalZipCodeSubmit,
  isLoading,
  uploadedDocuments, // documents from App state
  shareDocumentsWithLender,
  setShareDocumentsWithLender,
  consentToEmailDocuments,
  setConsentToEmailDocuments,
  optionalMessage,
  setOptionalMessage,
  handleDownloadDocuments, // function from App to download docs
  sendConnectionEmail // function from App to send email
}) => {
  return (
    <div className="section flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Connect with a Professional</h1>
      <p className="mb-8 text-center max-w-2xl">
        Ready to take the next step? Find a trusted Lender or Realtor.<br />
        <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Your information is always private and secure.</span>
      </p>

      <div className="card w-full max-w-lg">
        {!selectedProfessionalType && (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Who would you like to connect with?</h2>
            <button
              onClick={() => setSelectedProfessionalType('lender')}
              className="w-full mb-4 rounded-[18px] py-2 px-6 bg-[var(--color-accent)] text-white font-semibold text-lg border-2 border-black shadow-md transition-all duration-150 hover:bg-[#2d7d8a] hover:transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Connect with a Lender
            </button>
            <button
              onClick={() => setSelectedProfessionalType('realtor')}
              className="w-full rounded-[18px] py-2 px-6 bg-[var(--color-primary)] text-white font-semibold text-lg border-2 border-black shadow-md transition-all duration-150 hover:bg-[#4693c2] hover:transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Connect with a Realtor
            </button>
          </>
        )}

        {selectedProfessionalType && (
          <>
            <div className="flex flex-col items-center mb-6">
              <button
                onClick={() => setSelectedProfessionalType(null)}
                className="mb-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold shadow transition"
              >
                ← Back to Selection
              </button>
              <h2 className="text-xl font-bold text-center">
                Find a {selectedProfessionalType === 'lender' ? 'Lender' : 'Realtor'} Near You
              </h2>
            </div>
            <p className="text-sm mb-4 text-center">Where are you looking to buy?</p>
            <input
              type="text"
              className="input"
              value={userZipCode}
              onChange={(e) => setUserZipCode(e.target.value)}
              placeholder="e.g., 75069"
              maxLength="5"
            />
            <button
              onClick={handleProfessionalZipCodeSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl py-2 font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition mb-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
              ) : (
                <span>Search for Professionals</span>
              )}
            </button>

            {/* Professional Cards Section */}
            <div className="space-y-6">
              {selectedProfessionalType === 'lender' && (
                <div className="card bg-blue-50 border-blue-200 max-w-md mx-auto">
                  <span className="absolute top-2 right-2 bg-[var(--color-accent)] text-white text-xs font-semibold px-3 py-1 rounded-full">FEATURED</span>
                  <img
                    src="https://placehold.co/80x80/0077b6/ffffff?text=JL"
                    alt="Jeff Levesque"
                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-[#0077b6] mx-auto"
                  />
                  <h3 className="text-xl font-bold text-blue-900 mb-1">Jeff Levesque</h3>
                  <p className="text-base">Loan Officer | NMLS # 2510460</p>
                  <p className="text-sm mb-3">ALoan4You.com PLLC (Corporate NMLS # 2429344)</p>
                  <p className="text-sm italic mb-4">"Your trusted guide to a smooth home loan experience."</p>

                  {uploadedDocuments.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-300">
                      <h4 className="font-semibold mb-3">Document Sharing Options:</h4>
                      <p className="text-sm mb-3">Would you like to share your uploaded documents with Jeff Levesque?</p>
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="shareDocuments"
                          checked={shareDocumentsWithLender}
                          onChange={(e) => setShareDocumentsWithLender(e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="shareDocuments" className="text-sm font-medium">Yes, share my documents</label>
                      </div>

                      {shareDocumentsWithLender && (
                        <div className="mt-3 p-3 bg-blue-200 rounded-md border border-blue-300">
                          <p className="text-sm font-semibold mb-2">How would you like to share?</p>
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={handleDownloadDocuments}
                              className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl py-2 font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition"
                              disabled={isLoading}
                            >
                              Download My Documents (Zip File)
                            </button>
                            <div className="flex items-center mt-2">
                              <input
                                type="checkbox"
                                id="consentToEmail"
                                checked={consentToEmailDocuments}
                                onChange={(e) => setConsentToEmailDocuments(e.target.checked)}
                                className="mr-2 h-4 w-4"
                              />
                              <label htmlFor="consentToEmail" className="text-sm font-medium">
                                Email My Documents (Zip File) to Jeff
                              </label>
                            </div>
                            <p className="text-xs text-red-700 mt-1">
                              By checking this, you consent to attach your compiled document zip file to the email sent to Jeff Levesque.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <label htmlFor="optionalMessage" className="block text-sm font-medium mb-1">Optional Message for Jeff:</label>
                    <textarea
                      id="optionalMessage"
                      rows="3"
                      className="input"
                      value={optionalMessage}
                      onChange={(e) => setOptionalMessage(e.target.value)}
                      placeholder="e.g., 'Looking forward to discussing my pre-approval!'"
                    ></textarea>
                  </div>

                  <button
                    onClick={() => sendConnectionEmail("Jeff Levesque")}
                    className="w-full mt-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl py-2 font-semibold shadow hover:from-green-500 hover:to-green-600 transition"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <span>Send Connection Email</span>
                    )}
                  </button>
                  <p className="text-xs text-center mt-3 italic">
                    Only information and documents you've explicitly consented to share will be included in the email sent to the professional.
                  </p>
                </div>
              )}

              {selectedProfessionalType === 'realtor' && (
                <div className="card bg-green-50 border-green-200 max-w-md mx-auto">
                  <span className="absolute top-2 right-2 bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-1 rounded-full">FEATURED</span>
                  <img
                    src="https://placehold.co/80x80/22c55e/ffffff?text=KC"
                    alt="Kateleigh Clough"
                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-[#22c55e] mx-auto"
                  />
                  <h3 className="text-xl font-bold text-green-900 mb-1">Kateleigh Clough</h3>
                  <p className="text-base">Realtor | License # 807529</p>
                  <p className="text-sm mb-3">Miss10nRealty</p>
                  <p className="text-sm italic mb-4">"Making your homeownership dreams a reality, one key at a time."</p>
                  <div className="mt-2">
                    <label htmlFor="optionalMessageRealtor" className="block text-sm font-medium mb-1">Optional Message for Kateleigh:</label>
                    <textarea
                      id="optionalMessageRealtor"
                      rows="3"
                      className="input"
                      value={optionalMessage}
                      onChange={(e) => setOptionalMessage(e.target.value)}
                      placeholder="e.g., 'Excited to find my dream home with you!'"
                    ></textarea>
                  </div>
                  <button
                    onClick={() => sendConnectionEmail("Kateleigh Clough")}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl py-2 font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <span>Send Connection Email</span>
                    )}
                  </button>
                  <p className="text-xs text-center mt-3 italic">
                    Only information and documents you've explicitly consented to share will be included in the email sent to the professional.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectScreen;