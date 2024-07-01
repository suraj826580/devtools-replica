import React from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function RequestDetails({ request }) {
  if (!request)
    return <Typography>Select a request to view details</Typography>;

  const formatJSON = (data) => {
    if (typeof data === "string") {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <Box>
      <Typography variant="h6">Request Details</Typography>
      <Typography>URL: {request.url}</Typography>
      <Typography>Method: {request.method}</Typography>
      <Typography>Status: {request.status || "Pending"}</Typography>
      <Typography>Start Time: {request.startTime.toFixed(2)} ms</Typography>
      <Typography>
        End Time:{" "}
        {request.endTime ? request.endTime.toFixed(2) + " ms" : "Pending"}
      </Typography>
      <Typography>
        Duration:{" "}
        {request.endTime
          ? (request.endTime - request.startTime).toFixed(2) + " ms"
          : "Pending"}
      </Typography>

      {request.body && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Request Body (JSON)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {formatJSON(request.body)}
            </pre>
          </AccordionDetails>
        </Accordion>
      )}

      {request.responseBody && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Response Body</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {formatJSON(request.responseBody)}
            </pre>
          </AccordionDetails>
        </Accordion>
      )}

      {!request.ok && (
        <Typography color="error">
          Error: {request.error || `HTTP Error ${request.status}`}
        </Typography>
      )}
    </Box>
  );
}

export default RequestDetails;
