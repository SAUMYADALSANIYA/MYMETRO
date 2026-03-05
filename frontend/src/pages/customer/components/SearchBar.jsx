import "./../home.css";

export default function SearchBar({
  stations,
  source,
  destination,
  setSource,
  setDestination,
  onSearch,
  onShowAll,
}) {
  return (
    <form className="searchBar" onSubmit={onSearch}>
      <div className="field">
        <label>Source</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">Select source</option>
          {stations.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Destination</label>
        <select value={destination} onChange={(e) => setDestination(e.target.value)}>
          <option value="">Select destination</option>
          {stations.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <button className="btn" type="submit">Search</button>
      <button className="btn btnOutline" type="button" onClick={onShowAll}>
        Show All
      </button>
    </form>
  );
}