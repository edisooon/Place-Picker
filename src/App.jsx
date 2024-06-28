import { useRef, useState, useEffect } from "react";

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
  const modal = useRef();
  const selectedPlace = useRef();
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
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
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

  function handleRemovePlace() {
    setSelectedPlaces((prevSelectedPlaces) =>
      prevSelectedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();
    const selectedPlacesIds =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(
        selectedPlacesIds.filter((id) => id !== selectedPlace.current)
      )
    );
  }

  return (
    <>
      <Modal ref={modal}>
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
