function fetchCountries(name) {
  const url = 'https://restcountries.com/v3.1';
  const options = ['name', 'capital', 'population', 'flags', 'languages'];

  return fetch(`${url}/name/${name}?fields=${options.join(',')}`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}

export { fetchCountries };
