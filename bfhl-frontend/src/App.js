import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  Box,
  Typography,
  ListItemText,
  InputLabel,
} from "@mui/material";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");

  const options = ["alphabets", "numbers", "highest_lowercase"];

  // Handle JSON input change
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  // Submit the JSON to the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    try {
      const parsedInput = JSON.parse(jsonInput); // Validate JSON input
      const res = await axios.post("http://127.0.0.1:5000/bfhl", parsedInput);
      setResponse(res.data);
    } catch (error) {
      setError("Invalid JSON format or server error. Please check your input.");
    }
  };

  // Handle dropdown selections
  const handleOptionChange = (event) => {
    const { value } = event.target;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  // Render the filtered response based on the selected dropdown options
  const renderResponse = () => {
    if (!response) return null;

    return (
      <Box mt={2}>
        <Typography variant="h6">Response Data:</Typography>
        <ul>
          {selectedOptions.includes("alphabets") && (
            <li>Alphabets: {JSON.stringify(response.alphabets)}</li>
          )}
          {selectedOptions.includes("numbers") && (
            <li>Numbers: {JSON.stringify(response.numbers)}</li>
          )}
          {selectedOptions.includes("highest_lowercase") && (
            <li>
              Highest Lowercase Alphabet:{" "}
              {JSON.stringify(response.highest_lowercase_alphabet)}
            </li>
          )}
        </ul>
      </Box>
    );
  };

  return (
    <Box p={3} className="App">
      <Typography variant="h4" gutterBottom>
        Bajaj Finserv Health Dev Challenge
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Enter JSON Data"
            multiline
            rows={5}
            value={jsonInput}
            onChange={handleInputChange}
            placeholder='{"data": ["A", "C", "z"]}'
            variant="outlined"
            error={Boolean(error)}
            helperText={error || "Enter valid JSON"}
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>

      {response && (
        <>
          <Box mt={3}>
            <FormControl fullWidth>
              <InputLabel id="select-options-label">
                Select Response Data
              </InputLabel>
              <Select
                labelId="select-options-label"
                multiple
                value={selectedOptions}
                onChange={handleOptionChange}
                renderValue={(selected) => selected.join(", ")}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={selectedOptions.includes(option)} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {renderResponse()}
        </>
      )}
    </Box>
  );
}

export default App;
