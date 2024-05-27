import React, { useRef, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import fakeData from '../api/fakeData.js';

const MapComponent = () => {
  const mapRef = useRef();

  useEffect(() => {
    const features = fakeData.map((data) => {

      // Koordinatları dönüştürme (Google Maps:EPSG:4326 to  OpenLayers:EPSG:3857)
      const transformedCoordinates = fromLonLat(data.coordinates);

      const feature = new Feature({
        geometry: new Point(transformedCoordinates),
        title: data.title,
        description: data.description
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            scale: 0.6,
          }),
          text: new Text({
            text: data.title,
            offsetY: 20,
            fill: new Fill({
              color: '#000'
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 20
            })
          })
        })
      );

      return feature;
    });

    const vectorSource = new VectorSource({
      features: features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([32.75994190657685, 39.91169925939654]),
        zoom: 15
      })
    });

    return () => map.setTarget(undefined); // Cleanup map instance on component unmount
  }, []);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100vh' }}></div>
  );
};

export default MapComponent;
