import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function About() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".fade-in-section");
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        if (isVisible) {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center pt-24"
        style={{
          backgroundImage: `url('/images/about-page-bg.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent">
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="max-w-2xl text-white bg-gray-50/20 rounded-lg p-8">
              <h1 className="text-5xl font-bold mb-6">
                Bridging Communication Gaps Through Technology
              </h1>
              <p className="text-xl opacity-90">
                Transforming sign language communication with Advanced
                technology
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Information Section */}
      <div className="container mx-auto px-6 py-20">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-section"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="text-4xl text-blue-600 mb-4">
              <i className="fas fa-info-circle"></i>
            </div>
            <h3 className="text-2xl font-semibold mb-4">About the Project</h3>
            <p className="text-gray-600">
              Our innovative sign language translator bridges the communication
              gap between the deaf community and others through real-time ISL to
              text conversion and vice versa.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl text-blue-600 mb-4">
              <i className="fas fa-cube"></i>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Key Modules</h3>
            <ul className="text-gray-600 space-y-2">
              <li>
                <i className="fas fa-check text-green-500 mr-2"></i>ISL to Text
                Conversion
              </li>
              <li>
                <i className="fas fa-check text-green-500 mr-2"></i>Text to ISL
                Conversion
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl text-blue-600 mb-4">
              <i className="fas fa-code"></i>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Technologies Used</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <i className="fab fa-react mr-2 text-cyan-500"></i>React
              </div>
              <div>
                <i className="fab fa-python mr-2 text-yellow-500"></i>Python
              </div>
              <div>
                <i className="fas fa-project-diagram mr-2 text-purple-500"></i>
                TensorFlow
              </div>
              <div>
                <i className="fas fa-video mr-2 text-blue-500"></i>OpenCV
              </div>
              <div>
                <i className="fas fa-hand-paper mr-2 text-pink-500"></i>
                MediaPipe
              </div>
              <div>
                <i className="fas fa-language mr-2 text-green-600"></i>Spacy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Meet Our Team
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-section"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            }}
          >
            {/* Team Lead */}

            <div className="col-span-2 md:col-span-3 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center max-w-xl mx-auto">
                <img
                  src="/images/faraan.jpg"
                  alt="Mohammed Faraan"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Mohammed Faraan</h3>
                <p className="text-blue-600 mb-4 font-bold">Team Lead</p>
                <p className="text-gray-600">
                  Govt. CPC Polytechnic College, Mysore
                </p>
              </div>
            </div>

            {/* Team Members Row 1 */}
            <div className="col-span-1 md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
                  <img
                    src="/images/harshitha.jpg"
                    alt="Harshithashree N S"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Harshithashree N S
                  </h3>
                  <p className="text-blue-600 mb-4 font-bold">Team member</p>
                  <p className="text-gray-600">
                    Govt. CPC Polytechnic College, Mysore
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
                  <img
                    src="/images/krupank.jpg"
                    alt="Krupanka R"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">Krupanka R</h3>
                  <p className="text-blue-600 mb-4 font-bold">Team member</p>
                  <p className="text-gray-600">
                    Govt. CPC Polytechnic College, Mysore
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members Row 2 */}
            <div className="col-span-1 md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
                  <img
                    src="/images/muzammil.jpg"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Mohammed Muzammil Baig
                  </h3>
                  <p className="text-blue-600 mb-4 font-bold">Team member</p>
                  <p className="text-gray-600">
                    Govt. CPC Polytechnic College, Mysore
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
                  <img
                    src="/images/priyanka.jpg"
                    alt="Lisa Wang"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">Priyanka K N</h3>
                  <p className="text-blue-600 mb-4 font-bold">Team member</p>
                  <p className="text-gray-600">
                    Govt. CPC Polytechnic College, Mysore
                  </p>
                </div>
              </div>

              
            </div>

            {/* Project Guide */}
            <div className="col-span-1 md:col-span-3 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
                    <img
                      src="/images/user.png"
                      alt="Shekhara K N"
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2">Shekhara K N</h3>
                    <p className="text-blue-600 mb-4 font-bold">
                      Project Guide
                    </p>
                    <p className="text-gray-600">
                      Head of Department, CSE <br />
                      Govt. CPC Polytechnic College, Mysore
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
                    <img
                      src="/images/bharath.jpg"
                      alt="Bharath"
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2">Bharath</h3>
                    <p className="text-blue-600 mb-4 font-bold">
                      Project Guide
                    </p>
                    <p className="text-gray-600">
                      Lecturer, CSE <br />
                      Govt. CPC Polytechnic College, Mysore
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
