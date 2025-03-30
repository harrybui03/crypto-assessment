import { Box, Typography } from "@mui/material";

interface ErrorDisplayProps {
    message?: string;
}

const ErrorDisplay = ({ message = "Error loading data" }: ErrorDisplayProps) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Typography color="error" sx={{ ml: 1 }}>
                {message}
            </Typography>
        </Box>
    )
}

export default ErrorDisplay;