# Place-Picker
PlacePicker webapp with React, using react techniques including useEffect hook

## main hooks used
- useEffect
- useCallback

## features
- the available places are sorted based on the distance between the places and current user position
- users could select places from available places by clicking the place image
- users could unselect places from selected places by clicking the place image
- a deletion confirmation modal would show up, and there's a progress bar to indicate the time remaining for an automatic deletion
- all the selected places are stored in and synchronized with the browser's local storage

## useEffect usecase
- to prevent from infinite loop due to recomposition for state changes
- to get access to the DOM element ref (function in useEffect will be excuted after returning JSX)
- to clean up resources before recomposition or decomposition with return a function value (e.g., clearInterval, clearTimeout)
- [note] if the dependancy list has any function, it's safer to wrap the dependant function with useCallback hook to prevent from infinite loop

## images
<img width="709" alt="Screen Shot 2024-06-28 at 3 17 46 PM" src="https://github.com/ezbuckeye/Place-Picker/assets/105604551/a69d871a-92d2-4f71-9d46-f68c8c6055f9">
<img width="439" alt="Screen Shot 2024-06-28 at 3 18 43 PM" src="https://github.com/ezbuckeye/Place-Picker/assets/105604551/d72ae75b-e099-48cb-98ab-21005695a95a">
