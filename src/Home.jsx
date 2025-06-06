import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to handle language change from Navbar
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Navbar onLanguageChange={handleLanguageChange} />
      {selectedLanguage && selectedLanguage === "english" ? (
        // English Language Section
        <div>
          {/* Hero Section */}
          <section
            id="home"
            className="pt-24 pb-20 relative overflow-hidden"
            style={{ minHeight: "100vh" }}
          >
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent z-10"></div>
              <img
                src="/images/bg-image.jpg"
                alt="Sign language translation visualization"
                className="w-full h-full bg-cover bg-top"
                style={{ backgroundPosition: "70% center" }}
              />
            </div>
            <div className="container mx-auto px-6 relative z-20 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 text-left mb-10 md:mb-0 pt-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Breaking Barriers Through Sign Language
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-lg">
                  Our web-based tool translates between Indian Sign Language and
                  Text in real-time, making communication accessible for
                  everyone.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/isl-to-text"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
                  >
                    <i className="fas fa-play-circle mr-2"></i>
                    Try It Now
                  </Link>
                  <Link
                    to="/about"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
                  >
                    <i className="fas fa-info-circle mr-2"></i>
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
              <i className="fas fa-chevron-down text-2xl text-blue-600"></i>
            </div>
          </section>
          {/* Key Features Section */}
          <section id="features" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Powerful Translation Features
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our tool combines advanced technology with user-friendly
                  design to make sign language translation seamless.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Feature 1 */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <i className="fas fa-bolt text-blue-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    Real-Time Translation
                  </h3>
                  <p className="text-gray-600 text-center">
                    Instantly translate between Indian Sign Language and text
                    with minimal delay.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <i className="fas fa-check-circle text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    High Accuracy
                  </h3>
                  <p className="text-gray-600 text-center">
                    Advanced algorithms ensure precise recognition and
                    translation of sign gestures.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <i className="fas fa-user-friends text-green-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    User-Friendly Interface
                  </h3>
                  <p className="text-gray-600 text-center">
                    Intuitive design makes the tool accessible for users of all
                    technical abilities.
                  </p>
                </div>
                {/* Feature 4 */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <i className="fas fa-universal-access text-yellow-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    Accessibility Focused
                  </h3>
                  <p className="text-gray-600 text-center">
                    Designed with inclusivity in mind to bridge communication
                    gaps effectively.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 bg-white shadow-2xl">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our translation process is simple, efficient, and powered by
                  advanced technology.
                </p>
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 z-0"></div>
                {/* Step 1 */}
                <div className="relative z-10 mb-12 md:mb-0">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                      <h3 className="text-2xl font-semibold mb-3">Capture</h3>
                      <p className="text-gray-600">
                        Our system captures sign language gestures through your
                        device's camera or accepts text input for translation.
                      </p>
                    </div>
                    <div className="md:w-12 w-full flex justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        1
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 hidden md:block">
                      <div className="overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
                        <img
                          src="/images/how-it-works-1.jpg"
                          alt="Capture phase"
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="relative z-10 mb-12 md:mb-0 md:mt-24">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 hidden md:block md:text-right">
                      <div className="overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
                        <img
                          src="/images/how-it-works-2.jpg"
                          alt="Process phase"
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="md:w-12 w-full flex justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        2
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                      <h3 className="text-2xl font-semibold mb-3">Process</h3>
                      <p className="text-gray-600">
                        Advanced algorithms analyze the input, recognizing
                        patterns and mapping them to linguistic elements.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="relative z-10 mb-12 md:mb-0 md:mt-24">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                      <h3 className="text-2xl font-semibold mb-3">Translate</h3>
                      <p className="text-gray-600">
                        The system converts the processed input into the target
                        format - text from signs or signs from text.
                      </p>
                    </div>
                    <div className="md:w-12 w-full flex justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        3
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 hidden md:block">
                      <div className="overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
                        <img
                          src="/images/how-it-works-3.jpg"
                          alt="Translate phase"
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Step 4 */}
                <div className="relative z-10 md:mt-24">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 hidden md:block md:text-right">
                      <div className="overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
                        <img
                          src="/images/how-it-works-4.jpg"
                          alt="Output phase"
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="md:w-12 w-full flex justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        4
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                      <h3 className="text-2xl font-semibold mb-3">Output</h3>
                      <p className="text-gray-600">
                        The translation is displayed in real-time, enabling
                        seamless communication between sign language users and
                        others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        // Kannada Language Section
        <div>
          {/* Hero Section */}
          <section
            id="home"
            className="pt-24 pb-20 relative overflow-hidden"
            style={{ minHeight: "100vh" }}
          >
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent z-10"></div>
              <img
                src="/images/bg-image.jpg"
                alt="Sign language translation visualization"
                className="w-full h-full bg-cover bg-top"
                style={{ backgroundPosition: "70% center" }}
              />
            </div>
            <div className="container mx-auto px-6 relative z-20 flex flex-col md:flex-row items-center">
              <div className="md:w-3/5 text-left mb-10 md:mb-0 pt-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  ಸೈನ್ ಭಾಷೆಯ ಮೂಲಕ ಅಡೆತಡೆಗಳನ್ನು ದಾಟಿ
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-lg">
                  ನಮ್ಮ ವೆಬ್‌ ಆಧಾರಿತ ಸಾಧನವು ಭಾರತೀಯ ಸಹಿ ಭಾಷೆ ಮತ್ತು ಪಠ್ಯದ ನಡುವಣ
                  ತಕ್ಷಣದ ಭಾಷಾಂತರವನ್ನು ಒದಗಿಸಿ, ಎಲ್ಲರಿಗೂ ಸಂವಹನವನ್ನು
                  ಸುಲಭಗೊಳಿಸುತ್ತದೆ.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/isl-to-text"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
                  >
                    <i className="fas fa-play-circle mr-2"></i>
                    ಈಗ ಪ್ರಯತ್ನಿಸಿ
                  </Link>
                  <Link
                    to="/about"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
                  >
                    <i className="fas fa-info-circle mr-2"></i>
                    ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
              <i className="fas fa-chevron-down text-2xl text-blue-600"></i>
            </div>
          </section>

          {/* Key Features Section */}
          <section id="features" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ಶಕ್ತಿಶಾಲಿ ಭಾಷಾಂತರ ವೈಶಿಷ್ಟ್ಯಗಳು
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  ನಮ್ಮ ಸಾಧನವು ಉನ್ನತ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಬಳಕೆದಾರ ಸ್ನೇಹಿ ವಿನ್ಯಾಸವನ್ನು
                  ಸಂಯೋಜಿಸಿ, ಸಹಿ ಭಾಷೆ ಭಾಷಾಂತರವನ್ನು ನಿರ್ವಹಣೀಯವಾಗಿ ಮಾಡುತ್ತದೆ.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Feature 1 */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <i className="fas fa-bolt text-blue-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    ತಕ್ಷಣದ ಭಾಷಾಂತರ
                  </h3>
                  <p className="text-gray-600 text-center">
                    ಕನಿಷ್ಟ ವಿಳಂಬದಲ್ಲಿ ಭಾರತೀಯ ಸಹಿ ಭಾಷೆ ಮತ್ತು ಪಠ್ಯದ ನಡುವಣ ತಕ್ಷಣದ
                    ಭಾಷಾಂತರ.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <i className="fas fa-check-circle text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    ಉಚ್ಚ ನಿಖರತೆ
                  </h3>
                  <p className="text-gray-600 text-center">
                    ಅತ್ಯಾಧುನಿಕ ಅಲ್ಗೋರಿದ್ಮ್ಗಳು ಸಹಿ ಜಾರಿಗೆಗಳನ್ನು ನಿಖರವಾಗಿ ಗುರುತಿಸಿ
                    ಭಾಷಾಂತರಿಸುವುದನ್ನು ಖಚಿತಪಡಿಸುತ್ತವೆ.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <i className="fas fa-user-friends text-green-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    ಬಳಕೆದಾರ ಸ್ನೇಹಿ ಇಂಟರ್ಫೇಸ್
                  </h3>
                  <p className="text-gray-600 text-center">
                    ಸರಳ ವಿನ್ಯಾಸವು ಎಲ್ಲಾ ತಾಂತ್ರಿಕ ಜ್ಞಾನದ ಬಳಕೆದಾರರಿಗೆ ಸಾಧನವನ್ನು
                    ಲಭ್ಯವಾಗುವಂತೆ ಮಾಡುತ್ತದೆ.
                  </p>
                </div>
                {/* Feature 4 */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <i className="fas fa-universal-access text-yellow-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    ಲಭ್ಯತೆ-ನಿರ್ದೇಶಿತ
                  </h3>
                  <p className="text-gray-600 text-center">
                    ಸರ್ವಸಾಮೇೀಲತೆಗೆ ಗಮನವಿಟ್ಟು ಸಂವಹನದ ಅಂತರಗಳನ್ನು ಪರಿಣಾಮಕಾರಿಯಾಗಿ
                    ಸೇತುವೆಗೊಳಿಸಲಾಗಿದೆ.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 bg-white shadow-2xl">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  ನಮ್ಮ ಭಾಷಾಂತರ ಪ್ರಕ್ರಿಯೆ ಸರಳ, ಪರಿಣಾಮಕಾರಿ ಮತ್ತು ಉನ್ನತ
                  ತಂತ್ರಜ್ಞಾನದಿಂದ ಚಾಲಿತವಾಗಿದೆ.
                </p>
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 z-0"></div>
                {/* Step 1 */}
                <div className="relative z-10 mb-12 md:mb-0">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                      <h3 className="text-2xl font-semibold mb-3">ಗ್ರಹಣ</h3>
                      <p className="text-gray-600">
                        ನಮ್ಮ ವ್ಯವಸ್ಥೆ ನಿಮ್ಮ ಸಾಧನದ ಕ್ಯಾಮೆರಾ ಮೂಲಕ ಸಹಿ ಭಾಷೆ
                        ಅನುಕ್ರಮಣಗಳನ್ನು ಗ್ರಹಿಸುತ್ತದೆ ಅಥವಾ ಭಾಷಾಂತರಕ್ಕಾಗಿ ಪಠ್ಯ
                        ಇನ್ಪುಟ್ ಸ್ವೀಕರಿಸುತ್ತದೆ.
                      </p>
                    </div>
                    <div className="md:w-12 w-full flex justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        1
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 hidden md:block">
                      <div className="overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
                        <img
                          src="/images/how-it-works-1.jpg"
                          alt="Capture phase"
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="relative z-10 mb-12 md:mb-0 md:mt-24">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 hidden md:block md:text-right">
                      <div className="overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
                        <img
                          src="/images/how-it-works-2.jpg"
                          alt="Process phase"
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="md:w-12 w-full flex justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        2
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                      <h3 className="text-2xl font-semibold mb-3">ಪ್ರಕ್ರಿಯೆ</h3>
                      <p className="text-gray-600">
                        ಅತ್ಯಾಧುನಿಕ ಅಲ್ಗೋರಿದ್ಮ್ಗಳು ಇನ್ಪುಟ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸಿ,
                        ಮಾದರಿಗಳನ್ನು ಗುರುತಿಸಿ ಭಾಷಾ ಘಟಕಗಳಿಗೆ ನಕ್ಷೆಗೊಳಿಸುತ್ತವೆ.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="relative z-10 mb-12 md:mb-0 md:mt-24">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                      <h3 className="text-2xl font-semibold mb-3">ಭಾಷಾಂತರ</h3>
                      <p className="text-gray-600">
                        ವ್ಯವಸ್ಥೆ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿದ ಇನ್ಪುಟ್ ಅನ್ನು ಗುರಿ ರೂಪಕ್ಕೆ
                        ಪರಿವರ್ತಿಸುತ್ತದೆ - ಸಹಿ ಜತೆ ಪಠ್ಯ ಅಥವಾ ಪಠ್ಯದಿಂದ ಸಹಿ.
                      </p>
                    </div>
                    <div className="md:w-12 w-full flex justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        3
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 hidden md:block">
                      <div className="overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
                        <img
                          src="/images/how-it-works-3.jpg"
                          alt="Translate phase"
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Step 4 */}
                <div className="relative z-10 md:mt-24">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 hidden md:block md:text-right">
                      <div className="overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
                        <img
                          src="/images/how-it-works-4.jpg"
                          alt="Output phase"
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="md:w-12 w-full flex justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        4
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                      <h3 className="text-2xl font-semibold mb-3">ಫಲಿತಾಂಶ</h3>
                      <p className="text-gray-600">
                        ಭಾಷಾಂತರವನ್ನು ತಕ್ಷಣದವಾಗಿ ಪ್ರದರ್ಶಿಸಿ, ಸಹಿ ಭಾಷೆ ಬಳಕೆದಾರರು
                        ಮತ್ತು ಇತರರ ನಡುವಣ ನಿರ್ಭಂಧ ರಹಿತ ಸಂವಹನವನ್ನು
                        ಸಾಧ್ಯವಾಗಿಸುತ್ತದೆ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Home;
