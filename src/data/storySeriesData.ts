
// Define the data structure for our categories
export type StoryLocation = {
  name: string;
  display: string;
};

export type StorySubcategory = {
  name: string;
  display: string;
  locations: StoryLocation[];
};

export type StoryCategory = {
  name: string;
  display: string;
  subcategories: StorySubcategory[];
};

// The full structured data - these are all Signature Editions
export const storySeriesData: StoryCategory[] = [
  {
    name: 'sports',
    display: 'Sports',
    subcategories: [
      {
        name: 'baseball',
        display: 'Baseball',
        locations: [
          { name: 'sanDiego', display: 'San Diego' },
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'sanFrancisco', display: 'San Francisco' },
          { name: 'chicago', display: 'Chicago' },
          { name: 'newYork', display: 'New York' },
          { name: 'boston', display: 'Boston' },
          { name: 'philadelphia', display: 'Philadelphia' },
          { name: 'stLouis', display: 'St. Louis' },
          { name: 'atlanta', display: 'Atlanta' },
          { name: 'cleveland', display: 'Cleveland' },
          { name: 'detroit', display: 'Detroit' },
          { name: 'cincinnati', display: 'Cincinnati' },
          { name: 'pittsburgh', display: 'Pittsburgh' },
          { name: 'kansasCity', display: 'Kansas City' },
          { name: 'houston', display: 'Houston' },
          { name: 'seattle', display: 'Seattle' },
          { name: 'miami', display: 'Miami' },
          { name: 'phoenix', display: 'Phoenix' },
          { name: 'denver', display: 'Denver' },
          { name: 'minneapolis', display: 'Minneapolis' },
          { name: 'baltimore', display: 'Baltimore' },
          { name: 'milwaukee', display: 'Milwaukee' },
          { name: 'toronto', display: 'Toronto' },
          { name: 'lasVegas', display: 'Las Vegas' },
        ],
      },
      {
        name: 'football',
        display: 'Football',
        locations: [
          { name: 'greenBay', display: 'Green Bay' },
          { name: 'dallas', display: 'Dallas' },
          { name: 'newYork', display: 'New York' },
          { name: 'sanFrancisco', display: 'San Francisco' },
          { name: 'chicago', display: 'Chicago' },
          { name: 'pittsburgh', display: 'Pittsburgh' },
          { name: 'miami', display: 'Miami' },
          { name: 'newEngland', display: 'New England' },
          { name: 'philadelphia', display: 'Philadelphia' },
          { name: 'kansasCity', display: 'Kansas City' },
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'lasVegas', display: 'Las Vegas' },
        ],
      },
      {
        name: 'basketball',
        display: 'Basketball',
        locations: [
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'boston', display: 'Boston' },
          { name: 'chicago', display: 'Chicago' },
          { name: 'newYork', display: 'New York' },
          { name: 'sanFrancisco', display: 'San Francisco' },
          { name: 'dallas', display: 'Dallas' },
          { name: 'miami', display: 'Miami' },
          { name: 'phoenix', display: 'Phoenix' },
          { name: 'philadelphia', display: 'Philadelphia' },
          { name: 'milwaukee', display: 'Milwaukee' },
          { name: 'denver', display: 'Denver' },
        ],
      },
      {
        name: 'soccer',
        display: 'Soccer',
        locations: [
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'seattle', display: 'Seattle' },
          { name: 'portland', display: 'Portland' },
          { name: 'newYork', display: 'New York' },
          { name: 'atlanta', display: 'Atlanta' },
          { name: 'austin', display: 'Austin' },
          { name: 'stLouis', display: 'St. Louis' },
          { name: 'miami', display: 'Miami' },
          { name: 'sanDiego', display: 'San Diego' },
        ],
      },
      {
        name: 'hockey',
        display: 'Hockey',
        locations: [
          { name: 'toronto', display: 'Toronto' },
          { name: 'montreal', display: 'Montreal' },
          { name: 'boston', display: 'Boston' },
          { name: 'newYork', display: 'New York' },
          { name: 'chicago', display: 'Chicago' },
          { name: 'detroit', display: 'Detroit' },
          { name: 'philadelphia', display: 'Philadelphia' },
          { name: 'pittsburgh', display: 'Pittsburgh' },
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'sanJose', display: 'San Jose' },
        ],
      },
      {
        name: 'olympics',
        display: 'Olympics',
        locations: [],
      },
    ],
  },
  {
    name: 'music',
    display: 'Music',
    subcategories: [
      {
        name: 'rock',
        display: 'Rock',
        locations: [
          { name: 'sanFrancisco', display: 'San Francisco' },
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'seattle', display: 'Seattle' },
          { name: 'newYork', display: 'New York' },
          { name: 'london', display: 'London' },
        ],
      },
      {
        name: 'jazz',
        display: 'Jazz',
        locations: [
          { name: 'newOrleans', display: 'New Orleans' },
          { name: 'chicago', display: 'Chicago' },
          { name: 'newYork', display: 'New York' },
          { name: 'kansasCity', display: 'Kansas City' },
          { name: 'stLouis', display: 'St. Louis' },
        ],
      },
      {
        name: 'hipHop',
        display: 'Hip-Hop',
        locations: [
          { name: 'newYork', display: 'New York' },
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'atlanta', display: 'Atlanta' },
          { name: 'detroit', display: 'Detroit' },
          { name: 'houston', display: 'Houston' },
        ],
      },
      {
        name: 'country',
        display: 'Country',
        locations: [
          { name: 'nashville', display: 'Nashville' },
          { name: 'austin', display: 'Austin' },
          { name: 'memphis', display: 'Memphis' },
          { name: 'tulsa', display: 'Tulsa' },
        ],
      },
      {
        name: 'punk',
        display: 'Punk',
        locations: [
          { name: 'london', display: 'London' },
          { name: 'newYork', display: 'New York' },
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'sanFrancisco', display: 'San Francisco' },
          { name: 'dc', display: 'DC' },
        ],
      },
      {
        name: 'blues',
        display: 'Blues',
        locations: [],
      },
      {
        name: 'folk',
        display: 'Folk',
        locations: [],
      },
      {
        name: 'pop',
        display: 'Pop',
        locations: [],
      },
      {
        name: 'electronic',
        display: 'Electronic',
        locations: [],
      },
    ],
  },
  {
    name: 'localHistory',
    display: 'Local History',
    subcategories: [
      {
        name: 'california',
        display: 'California',
        locations: [
          { name: 'sanDiego', display: 'San Diego' },
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'sanFrancisco', display: 'San Francisco' },
        ],
      },
      {
        name: 'newYork',
        display: 'New York',
        locations: [
          { name: 'brooklyn', display: 'Brooklyn' },
          { name: 'manhattan', display: 'Manhattan' },
        ],
      },
      {
        name: 'texas',
        display: 'Texas',
        locations: [
          { name: 'austin', display: 'Austin' },
        ],
      },
      {
        name: 'illinois',
        display: 'Illinois',
        locations: [
          { name: 'chicago', display: 'Chicago' },
        ],
      },
      {
        name: 'louisiana',
        display: 'Louisiana',
        locations: [
          { name: 'newOrleans', display: 'New Orleans' },
        ],
      },
      {
        name: 'massachusetts',
        display: 'Massachusetts',
        locations: [
          { name: 'boston', display: 'Boston' },
        ],
      },
      {
        name: 'pennsylvania',
        display: 'Pennsylvania',
        locations: [
          { name: 'philadelphia', display: 'Philadelphia' },
        ],
      },
    ],
  },
  {
    name: 'civilRights',
    display: 'Civil Rights',
    subcategories: [
      {
        name: 'blackHistory',
        display: 'Black History',
        locations: [
          { name: 'selma', display: 'Selma' },
          { name: 'montgomery', display: 'Montgomery' },
        ],
      },
      {
        name: 'womensRights',
        display: 'Women\'s Rights',
        locations: [
          { name: 'senecaFalls', display: 'Seneca Falls' },
        ],
      },
      {
        name: 'lgbtq',
        display: 'LGBTQ+ Movements',
        locations: [
          { name: 'sanFrancisco', display: 'San Francisco' },
          { name: 'newYork', display: 'New York' },
        ],
      },
      {
        name: 'laborHistory',
        display: 'Labor History',
        locations: [
          { name: 'chicago', display: 'Chicago' },
          { name: 'detroit', display: 'Detroit' },
        ],
      },
    ],
  },
  {
    name: 'culturalIcons',
    display: 'Cultural Icons',
    subcategories: [
      {
        name: 'film',
        display: 'Film',
        locations: [
          { name: 'losAngeles', display: 'Los Angeles' },
          { name: 'newYork', display: 'New York' },
        ],
      },
      {
        name: 'comedy',
        display: 'Comedy',
        locations: [
          { name: 'chicago', display: 'Chicago' },
          { name: 'newYork', display: 'New York' },
        ],
      },
      {
        name: 'literature',
        display: 'Literature',
        locations: [
          { name: 'oxford', display: 'Oxford' },
          { name: 'paris', display: 'Paris' },
        ],
      },
      {
        name: 'food',
        display: 'Food',
        locations: [
          { name: 'newOrleans', display: 'New Orleans' },
          { name: 'sanFrancisco', display: 'San Francisco' },
          { name: 'tokyo', display: 'Tokyo' },
        ],
      },
    ],
  },
  {
    name: 'scienceInnovation',
    display: 'Science & Innovation',
    subcategories: [
      {
        name: 'spaceRace',
        display: 'Space Race',
        locations: [
          { name: 'capeCanaveral', display: 'Cape Canaveral' },
          { name: 'houston', display: 'Houston' },
        ],
      },
      {
        name: 'medical',
        display: 'Medical',
        locations: [
          { name: 'baltimore', display: 'Baltimore' },
          { name: 'boston', display: 'Boston' },
        ],
      },
      {
        name: 'inventors',
        display: 'Inventors',
        locations: [
          { name: 'menloPark', display: 'Menlo Park' },
          { name: 'akron', display: 'Akron' },
        ],
      },
      {
        name: 'techPioneers',
        display: 'Tech Pioneers',
        locations: [
          { name: 'paloAlto', display: 'Palo Alto' },
          { name: 'mountainView', display: 'Mountain View' },
        ],
      },
    ],
  },
];

// For quicker access to all series
export const getAllStoryOptions = () => {
  const allOptions: {
    categoryName: string;
    categoryDisplay: string;
    subcategoryName: string;
    subcategoryDisplay: string;
    locationName: string;
    locationDisplay: string;
    fullDisplay: string;
  }[] = [];

  storySeriesData.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      if (subcategory.locations.length > 0) {
        subcategory.locations.forEach((location) => {
          allOptions.push({
            categoryName: category.name,
            categoryDisplay: category.display,
            subcategoryName: subcategory.name,
            subcategoryDisplay: subcategory.display,
            locationName: location.name,
            locationDisplay: location.display,
            fullDisplay: `${subcategory.display} - ${location.display}`,
          });
        });
      } else {
        allOptions.push({
          categoryName: category.name,
          categoryDisplay: category.display,
          subcategoryName: subcategory.name,
          subcategoryDisplay: subcategory.display,
          locationName: '',
          locationDisplay: '',
          fullDisplay: subcategory.display,
        });
      }
    });
  });

  return allOptions;
};
