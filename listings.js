const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const generateListings = (numberOfListings) => {
  const listings = [];

  const listingType = ['House', 'Apartment', 'Shed', 'Dorm', 'Farm'];
  const listingFacilities = ['Parkering', 'Elevator', 'Altan', 'Have', 'Husdyr'];

  for (let i = 0; i < numberOfListings; i++) {
    const listing = {};
    const randomTypeIndex = randomIntFromInterval(0, listingType.length - 1);
    const numberOfFacilities = randomIntFromInterval(1, listingFacilities.length - 1);
    const facilities = [];

    for (let i = 0; i < numberOfFacilities; i++) {
      const randomIndexFacilities = randomIntFromInterval(0, listingFacilities.length - 1);
      const randomFacility = listingFacilities[randomIndexFacilities];

      if (!(facilities.includes(randomFacility))) {
        facilities.push(randomFacility);
      }
    }

    listing.type = listingType[randomTypeIndex];
    listing.facilities = facilities;
    listing.price = randomIntFromInterval(1, 10000);
    listing.hasGarden = Boolean(randomIntFromInterval(0, 1));
    listing.size = randomIntFromInterval(12, 1000);
    listing.img = `https://loremflickr.com/200/200/${listing.type}`

    listings.push(listing);
  }

  return listings;
}

// Get DOM elements
const filterType = document.querySelector('#filterType');
const filterFacilities = document.querySelector('#filterFacilities');
const filterHasGarden = document.querySelector('#filterHasGarden');
const filterMinSize = document.querySelector('#filterMinSize');
const filterMaxSize = document.querySelector('#filterMaxSize');

// Initialize filter object with values from DOM
const filter = {
  type: filterType.value,
  facilities: filterFacilities.value,
  hasGarden: filterHasGarden.value,
  minSize: filterMinSize.value,
  maxSize: filterMaxSize.value,
};

// Whenever a filter value changes,
// the listings should be filtered again and rerendered
filterType.addEventListener('change', () => {
  filter.type = filterType.value;

  const filteredListings = filterListings(listings, filter);

  renderListings(filteredListings);
});

filterFacilities.addEventListener('change', () => {
  filter.facilities = filterFacilities.value;

  const filteredListings = filterListings(listings, filter);

  renderListings(filteredListings);
});

filterHasGarden.addEventListener('change', () => {
  const filterIsEmpty = filterHasGarden.value === '';

  filter.hasGarden = filterIsEmpty ? '' : filterHasGarden.value.toString() === 'true';

  const filteredListings = filterListings(listings, filter);

  renderListings(filteredListings);
});

filterMinSize.addEventListener('change', () => {
  filter.minSize = filterMinSize.value;

  const filteredListings = filterListings(listings, filter);

  renderListings(filteredListings);
});

filterMaxSize.addEventListener('change', () => {
  filter.maxSize = filterMaxSize.value;

  const filteredListings = filterListings(listings, filter);

  renderListings(filteredListings);
});


const compareStrings = (strValue1, strValue2) => {
  return strValue1.toLowerCase() === strValue2.toLowerCase();
}

const compareBoolean = (value1, value2) => value1 === value2;
const compareArray = (arrayValue, strValue) => arrayValue.includes(strValue);
const compareHigherNumber = (num1, num2) => num1 >= num2;
const compareSmallerNumber = (num1, num2) => num1 < num2;

const listingAttendsRequirements = (listing, filter) => {
  const filterKeys = Object.keys(filter);
  let includeListing = true;

  // The corresponding listingKey is necessary because 
  // minSize and maxSize don't exist in listings keys,
  // only in filter
  const mapFilterSettings = {
    type: {
      listingKey: 'type',
      comparisonMethod: compareStrings
    },
    facilities: {
      listingKey: 'facilities',
      comparisonMethod: compareArray
    },
    hasGarden: {
      listingKey: 'hasGarden',
      comparisonMethod: compareBoolean
    },
    minSize: {
      listingKey: 'size',
      comparisonMethod: compareHigherNumber
    },
    maxSize: {
      listingKey: 'size',
      comparisonMethod: compareSmallerNumber
    },
  }

  filterKeys.forEach(key => {
    if (filter[key] !== '') {
      const listingKey = mapFilterSettings[key].listingKey;
      const compare = mapFilterSettings[key].comparisonMethod;

      // The compare function translates to e.g.:
      // compareStrings(listing.type, filter.type)
      // compareArray(listing.facilities, filter.facilities)
      // ...
      const valuesAreEqual = compare(listing[listingKey], filter[key]);

      if (!valuesAreEqual) {
        includeListing = false;
      }
    }
  });

  return includeListing;
}

const filterListings = (listings, filter) => listings.filter(listing => listingAttendsRequirements(listing, filter));

const renderListings = (listings) => {
  let html = '';

  listings.forEach((listing, index) => {
    html += `<h2>Listing ${index + 1}:</h2>`;
    html += '<ul>';
    html += ` <li>Type: ${listing.type}</li>`;
    html += ` <li>Facilities: ${listing.facilities}</li>`;
    html += ` <li>Price: ${listing.price}</li>`;
    html += ` <li>HasGarden: ${listing.hasGarden}</li>`;
    html += ` <li>Size: ${listing.size}</li>`;
    html += '</ul>';
  });

  document.querySelector('#listings').innerHTML = html;
}

/**
 * Call functions when page 
 * loads for the first time
 */

const listings = generateListings(20);
const filteredListings = filterListings(listings, filter);

renderListings(filteredListings);
