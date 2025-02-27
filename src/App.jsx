import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const selectedPlacesIds =
  JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const initialSelectedPlaces = selectedPlacesIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState(initialSelectedPlaces);
  const [sortedAvailablePlaces, setSortedAvailablePlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setSortedAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setIsModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsModalOpen(false);
  }

  function handleSelectPlace(id) {
    setSelectedPlaces((prevSelectedPlaces) => {
      if (prevSelectedPlaces.some((place) => place.id === id)) {
        return prevSelectedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevSelectedPlaces];
    });
    const selectedPlacesIds =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (selectedPlacesIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...selectedPlacesIds])
      );
    }
  }

  const handleRemovePlace = useCallback(() => {
    setSelectedPlaces((prevSelectedPlaces) =>
      prevSelectedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setIsModalOpen(false);
    const selectedPlacesIds =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(
        selectedPlacesIds.filter((id) => id !== selectedPlace.current)
      )
    );
  }, []);

  return (
    <>
      <Modal open={isModalOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={selectedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={"Retrieving and sorting the available places now ..."}
          places={sortedAvailablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
