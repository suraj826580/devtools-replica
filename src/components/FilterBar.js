import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Select,
  MenuItem,
  Button,
  TextareaAutosize,
  Typography,
} from "@mui/material";

function FilterBar({
  filterType,
  setFilterType,
  searchTerm,
  setSearchTerm,
  onSendRequest,
}) {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleSendRequest = () => {
    setJsonError("");
    setUrlError("");

    if (!url.trim()) {
      setUrlError("URL cannot be empty");
      return;
    }

    try {
      new URL(url);
    } catch (error) {
      setUrlError("Invalid URL format");
      return;
    }

    if (method !== "GET" && method !== "DELETE") {
      try {
        const parsedBody = JSON.parse(requestBody);
        onSendRequest(url, method, parsedBody);
      } catch (error) {
        setJsonError("Invalid JSON format");
        return;
      }
    } else {
      onSendRequest(url, method, requestBody);
    }
    // setUrl("");
    setRequestBody("");
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar style={{ flexDirection: "column", alignItems: "stretch" }}>
        <div style={{ display: "flex", marginBottom: 10 }}>
          <TextField
            label="Filter"
            variant="outlined"
            size="small"
            style={{ marginRight: 10 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filterType}
            size="small"
            onChange={(e) => setFilterType(e.target.value)}
            style={{ marginRight: 10 }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="xhr">XHR</MenuItem>
            <MenuItem value="js">JS</MenuItem>
            <MenuItem value="css">CSS</MenuItem>
            <MenuItem value="img">Image</MenuItem>
          </Select>
        </div>
        <div style={{ display: "flex", marginBottom: 10 }}>
          <TextField
            label="URL"
            variant="outlined"
            size="small"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError("");
            }}
            error={!!urlError}
            helperText={urlError}
            style={{ marginRight: 10, flexGrow: 1 }}
          />
          <Select
            value={method}
            size="small"
            onChange={(e) => setMethod(e.target.value)}
            style={{ marginRight: 10 }}>
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="PATCH">PATCH</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleSendRequest}>
            Send
          </Button>
        </div>
        {(method === "POST" || method === "PUT" || method === "PATCH") && (
          <>
            <TextareaAutosize
              minRows={3}
              placeholder="Request Body (JSON)"
              value={requestBody}
              onChange={(e) => {
                setRequestBody(e.target.value);
                setJsonError("");
              }}
              style={{ width: "100%", marginBottom: 10 }}
            />
            {jsonError && <Typography color="error">{jsonError}</Typography>}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default FilterBar;
