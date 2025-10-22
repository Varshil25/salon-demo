import React, { useState, useEffect } from "react";

// Import SCSS and Routes
import "./assets/scss/themes.scss";
import Route from "./Routes";

// Import Firebase Configuration and Fake Backend
// import { initFirebaseBackend } from "./helpers/firebase_helper";
import fakeBackend from "./helpers/AuthType/fakeBackend";
import ScrollToTop from "Components/Common/ScrollToTop";

// Activating fake backend
fakeBackend();

function App() {
  return (
    <React.Fragment>
      <ScrollToTop />
      <Route />
    </React.Fragment>
  );
}

export default App;
