// Fix the path to the JSON file
const jsonPath = '/invest.json';

// Debug utility to log fetch status
const logFetchStatus = async (url) => {
  try {
    const response = await fetch(url);
    console.log(`Fetch status for ${url}:`, {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Check if the JSON file exists in the public directory
console.log('Attempting to fetch JSON from:', jsonPath);
logFetchStatus(jsonPath)
  .then(response => response.json())
  .then(data => console.log('JSON data structure:', Object.keys(data)))
  .catch(error => console.error('Failed to load JSON:', error));
