# ReactProjects

A collection of 5 diverse React applications demonstrating various frontend development concepts and practical use cases.

## 📋 Projects Overview

### 1. Simple Notes App
A minimalist note-taking application that allows users to create, edit, and delete notes.

**Features:**
- Create new notes with title and content
- Edit existing notes
- Delete notes
- Persistent storage using localStorage
- Clean and intuitive user interface
- Responsive design for mobile and desktop

**Technologies:**
- React Hooks (useState, useEffect)
- localStorage API
- CSS3 for styling

---

### 2. Weather App
A real-time weather application that fetches and displays current weather information for any location.

**Features:**
- Search weather by city name
- Display current temperature, humidity, and weather conditions
- Weather icons based on conditions
- 5-day weather forecast
- Geolocation support to get local weather
- Temperature unit conversion (Celsius/Fahrenheit)

**Technologies:**
- React Hooks
- Weather API integration (OpenWeatherMap or similar)
- Fetch API for HTTP requests
- CSS3 with animations

---

### 3. Quiz App
An interactive quiz application with multiple-choice questions and score tracking.

**Features:**
- Multiple-choice questions
- Real-time score calculation
- Progress indicator
- Timer for each question
- Final score display with performance feedback
- Option to restart the quiz
- Different quiz categories

**Technologies:**
- React Hooks (useState, useEffect)
- Component composition
- Conditional rendering
- State management

---

### 4. Pomodoro Timer
A productivity timer based on the Pomodoro Technique to help manage work and break intervals.

**Features:**
- 25-minute work sessions
- 5-minute short breaks
- 15-minute long breaks after 4 sessions
- Start, pause, and reset functionality
- Session counter
- Audio notifications when timers complete
- Customizable timer durations
- Progress visualization

**Technologies:**
- React Hooks (useState, useEffect, useRef)
- setInterval/setTimeout for timer logic
- Audio API for notifications
- CSS animations

---

### 5. GIF Search
A GIF search engine that allows users to search and browse animated GIFs.

**Features:**
- Search GIFs by keyword
- Display trending GIFs
- Grid layout with infinite scroll
- Copy GIF URL to clipboard
- Preview GIFs on hover
- Responsive masonry layout
- Share functionality

**Technologies:**
- React Hooks
- GIPHY API integration
- Infinite scroll implementation
- Clipboard API
- CSS Grid/Flexbox

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 14.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  
- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
  - Or install yarn: `npm install -g yarn`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Installation

Follow these steps to set up the repository locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/HHHAAAANNNNN/ReactProjects.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd ReactProjects
   ```

3. **Install dependencies for each project**

   Each project is contained in its own directory. Navigate to each project and install dependencies:

   ```bash
   # Simple Notes App
   cd simple-notes-app
   npm install
   cd ..

   # Weather App
   cd weather-app
   npm install
   cd ..

   # Quiz App
   cd quiz-app
   npm install
   cd ..

   # Pomodoro Timer
   cd pomodoro-timer
   npm install
   cd ..

   # GIF Search
   cd gif-search
   npm install
   cd ..
   ```

   **Note:** If you're using yarn, replace `npm install` with `yarn install`

4. **Set up environment variables** (if required)

   Some projects may require API keys:

   - **Weather App**: Create a `.env` file in the `weather-app` directory
     ```
     REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
     ```
   
   - **GIF Search**: Create a `.env` file in the `gif-search` directory
     ```
     REACT_APP_GIPHY_API_KEY=your_giphy_api_key
     ```

   **How to get API keys:**
   - OpenWeatherMap: Sign up at [openweathermap.org/api](https://openweathermap.org/api)
   - GIPHY: Sign up at [developers.giphy.com](https://developers.giphy.com/)

---

## 🏃 Running the Projects

Each project runs independently on its own development server.

### Running Individual Projects

**1. Simple Notes App**
```bash
cd simple-notes-app
npm start
```
The app will open at `http://localhost:3000`

**2. Weather App**
```bash
cd weather-app
npm start
```
The app will open at `http://localhost:3000`

**3. Quiz App**
```bash
cd quiz-app
npm start
```
The app will open at `http://localhost:3000`

**4. Pomodoro Timer**
```bash
cd pomodoro-timer
npm start
```
The app will open at `http://localhost:3000`

**5. GIF Search**
```bash
cd gif-search
npm start
```
The app will open at `http://localhost:3000`

**Note:** Only one project can run on port 3000 at a time. If you want to run multiple projects simultaneously, you'll be prompted to run on a different port (e.g., 3001, 3002, etc.).

---

## 🛠️ Building for Production

To create an optimized production build for any project:

```bash
cd [project-directory]
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.

---

## 📁 Project Structure

```
ReactProjects/
├── simple-notes-app/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── weather-app/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── README.md
├── quiz-app/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── pomodoro-timer/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── gif-search/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── README.md
└── README.md
```

---

## 🧪 Testing

To run tests for any project:

```bash
cd [project-directory]
npm test
```

This launches the test runner in interactive watch mode.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Farhan Nugraha**
- GitHub: [@HHHAAAANNNNN](https://github.com/HHHAAAANNNNN)

---

## 🙏 Acknowledgments

- Create React App for project bootstrapping
- OpenWeatherMap API for weather data
- GIPHY API for GIF content
- React community for excellent documentation and resources

---

**Happy Coding! 🚀**