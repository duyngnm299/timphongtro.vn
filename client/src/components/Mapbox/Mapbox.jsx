import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect } from 'react';
import ReactGLMap, {
    Marker,
    useControl,
    NavigationControl,
    GeolocateControl,
    FullscreenControl,
    Source,
    Layer,
    Popup,
} from 'react-map-gl';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './Mapbox.module.scss';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function Mapbox({
    searchAddress,
    className,
    detailPostOfUser,
    editPost,
    previewPost,
}) {
    const [currentPosition, setCurrentPosition] = useState({});
    const [viewPort, setViewPort] = useState({});
    const [directions, setDirections] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const access_token =
        'pk.eyJ1IjoiZHV5bmdubTI5OSIsImEiOiJjbGI0c3kxZTMwYmljM3lsMGoyMHAyaGl1In0.WiMCQKoXHhQAx-k8nDJkdg';
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setCurrentPosition({
                ...currentPosition,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                zoom: 3.5,
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const showDirection = () => {
        currentPosition.latitude !== undefined &&
            axios
                .get(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${currentPosition.longitude},${currentPosition.latitude};${viewPort.longitude},${viewPort.latitude}?annotations=maxspeed&overview=full&geometries=geojson&access_token=${access_token}`,
                    {
                        headers: {
                            'Access-Control-Allow-Origin': `${HOST_NAME}`,
                        },
                    },
                )
                .then((res) => {
                    const distance = res.data.routes[0].distance / 1000;
                    const route = res.data.routes[0].geometry.coordinates;
                    const geojson = {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: route,
                        },
                    };
                    const layerStyle = {
                        id: 'data',
                        type: 'line',
                        source: 'data',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': '#3887be',
                            'line-width': 5,
                            'line-opacity': 0.75,
                        },
                    };
                    setDirections({
                        distance: distance.toFixed(2),
                        geojson: geojson,
                        layerStyle: layerStyle,
                    });
                })
                .catch((error) => console.log(error));
    };
    useEffect(() => {
        axios
            .get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchAddress}.json?access_token=${access_token}`,
            )
            .then(function (response) {
                // handle success
                setViewPort({
                    ...viewPort,
                    longitude: response.data.features[0].center[0],
                    latitude: response.data.features[1].center[1],
                    zoom: 12,
                    doubleClickZoom: false,
                    touchZoomRotate: false,
                    renderWorldCopies: false,
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        console.log(viewPort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchAddress]);

    const Geocoder = () => {
        const ctrl = new MapboxGeocoder({
            accessToken: access_token,
            marker: false,
            collapsed: true,
        });
        useControl(() => ctrl);
        ctrl.on('result', (e) => {
            const coords = e.result.geometry.coordinates;
            setViewPort({
                longitude: coords[0],
                latitude: coords[1],
                zoom: 12,
            });
        });
        return null;
    };
    useEffect(() => {
        showDirection();
    }, [viewPort]);
    return (
        <div
            className={cx(
                'map',
                className,
                detailPostOfUser && 'mapbox-details-post-user',
                editPost && 'edit-post',
                previewPost && 'preview-post',
            )}
        >
            {viewPort.latitude && viewPort.longitude && (
                <ReactGLMap
                    mapboxAccessToken={access_token}
                    initialViewState={{ ...viewPort }}
                    style={{
                        width: '100%',
                        height: className
                            ? '400px'
                            : previewPost
                            ? '300px'
                            : '270px',
                        borderRadius: '4px',
                    }}
                    interactive
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    onViewportChange={(newView) => {
                        setViewPort(newView);
                    }}
                    onLoad={showDirection}
                    // onMouseDown={showDirection}
                    // onRender={showDirection}
                    onClick={(e) => {
                        setViewPort({
                            longitude: e.lngLat.lng.toFixed(6),
                            latitude: e.lngLat.lat.toFixed(6),
                            zoom: 10,
                        });
                        setShowPopup(true);
                    }}
                >
                    {directions !== null && (
                        <Source
                            key={'abc'}
                            id="data"
                            type="geojson"
                            data={directions?.geojson}
                        >
                            <Layer key={'abcd'} {...directions?.layerStyle} />
                        </Source>
                    )}

                    <div className={cx('distance')}>
                        <span className={cx('distance-text')}>
                            Khoảng cách: {directions?.distance} km
                        </span>
                    </div>

                    <Marker
                        longitude={viewPort.longitude}
                        latitude={viewPort.latitude}
                        draggable
                        onDragEnd={(e) => {
                            setViewPort({
                                longitude: e.lngLat.lng.toFixed(6),
                                latitude: e.lngLat.lat.toFixed(6),
                                zoom: 10,
                            });
                        }}
                    />
                    {showPopup && (
                        <Popup
                            longitude={viewPort.longitude}
                            latitude={viewPort.latitude}
                            anchor="top"
                            closeOnClick
                            onClose={() => setShowPopup(false)}
                        >
                            <div className={cx('lngLat')}>
                                <span className={cx('lng')}>
                                    Kinh độ: {viewPort.longitude}
                                </span>
                                <span className={cx('lng')}>
                                    Vĩ độ: {viewPort.latitude}
                                </span>
                            </div>
                        </Popup>
                    )}
                    <NavigationControl position="bottom-right" />
                    <GeolocateControl
                        position="top-left"
                        trackUserLocation
                        onGeolocate={(e) => {
                            setCurrentPosition({
                                longitude: e.coords.longitude,
                                latitude: e.coords.latitude,
                            });
                        }}
                    />
                    <Geocoder position="top-right" />

                    <FullscreenControl position="bottom-right" />
                </ReactGLMap>
            )}
        </div>
    );
}
export default Mapbox;
