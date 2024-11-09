import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Snackbar } from "@mui/material";
import { UserFormData, FormErrorType } from "../types/types";
import { namePattern, emailPattern, API_BASE } from "../constant/data";

const CreateUser: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    emailId: "",
  });
  const [errors, setErrors] = useState<FormErrorType>({});
  const [formSubmitMessage, setFormSubmitMessage] = useState<null | string>(
    null
  );
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: { [key in keyof UserFormData]?: string } = {};

    // Validate first name
    if (
      !formData.firstName ||
      !namePattern.test(formData.firstName) ||
      formData.firstName.length > 100
    ) {
      newErrors.firstName =
        "First name should contain only letters and be less than 100 characters.";
    }

    // Validate last name
    if (
      !formData.lastName ||
      !namePattern.test(formData.lastName) ||
      formData.lastName.length > 100
    ) {
      newErrors.lastName =
        "Last name should contain only letters and be less than 100 characters.";
    }

    // Validate email
    if (!formData.emailId || !emailPattern.test(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      axios
        .post(`${API_BASE}/api/users`, {
          ...formData,
        })
        .then(() => {
          setFormSubmitMessage("Form submitted successfully");
          setFormData({ firstName: "", lastName: "", emailId: "" });
        })
        .catch((err) => {
          setFormSubmitMessage(err.response.data.message || err.message);
        })
        .finally(() => {
          setOpen(true);
          setLoading(false);
        });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        margin: "0 auto",
        padding: 2,
        gap: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create User
      </Typography>

      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        fullWidth
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
        fullWidth
      />
      <TextField
        label="Email"
        name="emailId"
        type="email"
        value={formData.emailId}
        onChange={handleChange}
        error={!!errors.emailId}
        helperText={errors.emailId}
        fullWidth
      />
      <Button
        variant="contained"
        type="submit"
        sx={{ marginTop: "1em" }}
        disabled={loading}
      >
        Submit
      </Button>
      {formSubmitMessage && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={formSubmitMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      )}
    </Box>
  );
};

export default CreateUser;
