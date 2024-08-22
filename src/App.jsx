import { useCallback, useState } from "react";
import "./App.css";
import { useEffect } from "react";
import debounce from "lodash.debounce";

function App() {
  const [query, setQuery] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const repsonse = await fetch("https://api.restful-api.dev/objects");
        if (!repsonse.ok) {
          throw new Error("Network Error");
        }
        const data = await repsonse.json();
        setAllData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterData = useCallback(
    debounce((searchTerm) => {
      if (searchTerm) {
        const filtered = allData.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData([]);
      }
    }, 300),
    [allData]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    filterData(value);
  };

  return (
    <div className="flex items-center mt-5 justify-center">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          className="border-2  z-20 bg-teal-100 px-2 py-1 rounded-lg"
        />
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {query && !loading && filteredData.length > 0 && (
          <ul className="absolute   z-10 bg-slate-200">
            {filteredData.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        )}
        {query && !loading && filteredData.length === 0 && (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}

export default App;
