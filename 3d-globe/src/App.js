import React, { useEffect, useRef } from "react";

import { sphereProjection } from "@here/harp-geoutils";
import { MapControls, MapControlsUI } from "@here/harp-map-controls";
import { CopyrightElementHandler, MapView } from "@here/harp-mapview";
import { OmvDataSource } from "@here/harp-omv-datasource";
import { theme } from "./config";

const minZoomLevel = 3;
const maxZoomLevel = 10;

const baseMap = new OmvDataSource({
  authenticationCode: process.env.REACT_APP_API_KEY,
});

const App = () => {
  const canvasRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = (mapRef.current = new MapView({
      theme,
      projection: sphereProjection,
      canvas: canvasRef.current,
      zoomLevel: 5,
    }));

    map.addDataSource(baseMap);

    const onWindowResize = () =>
      map.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", onWindowResize);

    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  useEffect(() => {
    const controls = new MapControls(mapRef.current);
    const uiControls = new MapControlsUI(controls);

    controls.minZoomLevel = minZoomLevel;
    controls.maxZoomLevel = maxZoomLevel;

    canvasRef.current.parentElement.appendChild(uiControls.domElement);

    CopyrightElementHandler.install("copyright-notice").attach(mapRef.current);
  }, []);

  return (
    <div className="app">
      <canvas ref={canvasRef} />
      <div id="copyright-notice"></div>
    </div>
  );
};

export default App;
