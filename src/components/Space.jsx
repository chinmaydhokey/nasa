import React, { useState, useEffect } from "react";
import {
  Calendar,
  Globe,
  Rocket,
  Star,
  Loader,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

const SpaceExplorer = () => {
  const [activeTab, setActiveTab] = useState("apod");
  const [apodData, setApodData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [selectedSol, setSelectedSol] = useState(1000);
  const [missions, setMissions] = useState([]);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);

  // NASA API key - in production, this should be in environment variables
  
  // Fetch Astronomy Picture of the Day
  const fetchAPOD = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}&date=${date}`
      );
      if (!response.ok) throw new Error("Failed to fetch APOD");
      const data = await response.json();
      setApodData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Mars Rover Photos
  const fetchMarsPhotos = async (sol) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${NASA_API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch Mars photos");
      const data = await response.json();
      setMarsPhotos(data.photos.slice(0, 12)); // Limit to 12 photos
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sample mission data (NASA doesn't have a dedicated historical missions API)
  const historicalMissions = [
    {
      name: "Apollo 11",
      date: "July 20, 1969",
      description: "First human moon landing mission",
      image:
        "https://images.nasa.gov/apollo-11-launch/apollo-11-launch~thumb.jpg",
      achievements: [
        "First humans on the Moon",
        "Collected 21.5 kg of lunar samples",
        "Duration: 8 days, 3 hours, 18 minutes",
      ],
    },
    {
      name: "Voyager 1",
      date: "September 5, 1977",
      description: "Interstellar space exploration",
      image:
        "https://images.nasa.gov/voyager-1-launch/voyager-1-launch~thumb.jpg",
      achievements: [
        "First spacecraft in interstellar space",
        "Jupiter and Saturn flyby",
        "Still operational after 45+ years",
      ],
    },
    {
      name: "Hubble Space Telescope",
      date: "April 24, 1990",
      description: "Revolutionary space observatory",
      image: "https://images.nasa.gov/hubble-launch/hubble-launch~thumb.jpg",
      achievements: [
        "Over 1.5 million observations",
        "13.4 billion years lookback time",
        "Revolutionized astronomy",
      ],
    },
    {
      name: "Mars Pathfinder",
      date: "July 4, 1997",
      description: "First Mars rover mission",
      image:
        "https://images.nasa.gov/mars-pathfinder/mars-pathfinder~thumb.jpg",
      achievements: [
        "First successful Mars rover",
        "Analyzed Martian rocks and soil",
        "Operated for 85 days",
      ],
    },
  ];

  useEffect(() => {
    fetchAPOD(selectedDate);
    setMissions(historicalMissions);
  }, [selectedDate]);

  useEffect(() => {
    if (activeTab === "mars") {
      fetchMarsPhotos(selectedSol);
    }
  }, [activeTab, selectedSol]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSolChange = (e) => {
    setSelectedSol(parseInt(e.target.value));
  };

  const nextMission = () => {
    setCurrentMissionIndex((prev) => (prev + 1) % missions.length);
  };

  const prevMission = () => {
    setCurrentMissionIndex(
      (prev) => (prev - 1 + missions.length) % missions.length
    );
  };

  const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-lg scale-105"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Space Explorer
          </h1>
          <p className="text-xl text-gray-300">
            Discover the universe with NASA's Open APIs
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <TabButton
            id="apod"
            icon={Star}
            label="Astronomy Picture"
            active={activeTab === "apod"}
            onClick={setActiveTab}
          />
          <TabButton
            id="mars"
            icon={Globe}
            label="Mars Photos"
            active={activeTab === "mars"}
            onClick={setActiveTab}
          />
          <TabButton
            id="missions"
            icon={Rocket}
            label="Historic Missions"
            active={activeTab === "missions"}
            onClick={setActiveTab}
          />
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader className="animate-spin mr-2" size={24} />
              <span>Loading...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200">Error: {error}</p>
            </div>
          )}

          {/* Astronomy Picture of the Day Tab */}
          {activeTab === "apod" && !loading && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Calendar className="mr-2" size={24} />
                    Astronomy Picture of the Day
                  </h2>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {apodData && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <img
                        src={apodData.url}
                        alt={apodData.title}
                        className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x400/1f2937/ffffff?text=Image+Not+Available";
                        }}
                      />
                      {apodData.media_type === "video" && (
                        <div className="bg-blue-900 p-3 rounded">
                          <p className="text-sm">
                            This is a video. Visit NASA's website to view it.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-blue-400">
                        {apodData.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {apodData.explanation}
                      </p>
                      <div className="text-sm text-gray-400">
                        <p>
                          <strong>Date:</strong> {apodData.date}
                        </p>
                        {apodData.copyright && (
                          <p>
                            <strong>Copyright:</strong> {apodData.copyright}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mars Photos Tab */}
          {activeTab === "mars" && !loading && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Globe className="mr-2 text-red-400" size={24} />
                    Mars Rover Photos
                  </h2>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Sol (Mars Day):</label>
                    <input
                      type="number"
                      value={selectedSol}
                      onChange={handleSolChange}
                      min={1}
                      max={3000}
                      className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none w-20"
                    />
                  </div>
                </div>

                {marsPhotos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {marsPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                      >
                        <img
                          src={photo.img_src}
                          alt={`Mars photo by ${photo.rover.name}`}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200/1f2937/ffffff?text=Image+Not+Available";
                          }}
                        />
                        <div className="p-3">
                          <p className="text-sm text-gray-300">
                            <strong>Camera:</strong> {photo.camera.full_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Sol {photo.sol} • {photo.earth_date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Globe className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400">
                      No photos available for this Sol. Try a different day.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Historic Missions Tab */}
          {activeTab === "missions" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Rocket className="mr-2 text-yellow-400" size={24} />
                    Historic Space Missions
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevMission}
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextMission}
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {missions[currentMissionIndex] && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <img
                        src={missions[currentMissionIndex].image}
                        alt={missions[currentMissionIndex].name}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x400/1f2937/ffffff?text=Mission+Image";
                        }}
                      />
                      <div className="flex justify-center space-x-2">
                        {missions.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentMissionIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentMissionIndex
                                ? "bg-blue-500"
                                : "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-yellow-400">
                        {missions[currentMissionIndex].name}
                      </h3>
                      <p className="text-blue-300 font-semibold">
                        {missions[currentMissionIndex].date}
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        {missions[currentMissionIndex].description}
                      </p>
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold flex items-center">
                          <Info className="mr-2" size={16} />
                          Key Achievements:
                        </h4>
                        <ul className="space-y-1">
                          {missions[currentMissionIndex].achievements.map(
                            (achievement, index) => (
                              <li
                                key={index}
                                className="text-gray-300 flex items-start"
                              >
                                <span className="text-blue-400 mr-2">•</span>
                                {achievement}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p>Powered by NASA Open APIs • Data courtesy of NASA</p>
        </div>
      </div>
    </div>
  );
};

export default SpaceExplorer;
