import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { MAP_API_KEY } from "../Address/constant";

const Component = () => {
  const [value, setValue] = useState(null);
  return (
    <div className="custom-places-autocomplete">
      <GooglePlacesAutocomplete
        selectProps={{
          value,
          onChange: setValue,
        }}
        apiKey={MAP_API_KEY}
      />
    </div>
  );
};

export default Component;
