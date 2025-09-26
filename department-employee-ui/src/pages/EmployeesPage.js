import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Container,
  Paper,
  Grid,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  OutlinedInput,
  FormHelperText
} from '@mui/material';

function calculateAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const ageDiff = Date.now() - birthDate.getTime();
  return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [initial, setInitial] = useState({
    EmployeeId: 0,
    FirstName: '',
    LastName: '',
    Email: '',
    DOB: '',
    Salary: '',
    DepartmentId: ''
  });

  // Form errors state for each field
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments')
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      alert(err.response?.data || err.message);
    }
  };

  const handleChange = (field, value) => {
    setInitial((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined })); // clear error on change
  };

  const validate = () => {
    let tempErrors = {};

    if (!initial.FirstName.trim()) tempErrors.FirstName = 'First name is required';
    if (!initial.LastName.trim()) tempErrors.LastName = 'Last name is required';

    if (!initial.Email.trim()) tempErrors.Email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initial.Email))
      tempErrors.Email = 'Email is invalid';

    if (!initial.DOB) tempErrors.DOB = 'Date of Birth is required';
    else if (isNaN(new Date(initial.DOB).getTime()))
      tempErrors.DOB = 'Invalid Date of Birth';

    if (!initial.Salary) tempErrors.Salary = 'Salary is required';
    else if (isNaN(parseFloat(initial.Salary)) || parseFloat(initial.Salary) <= 0)
      tempErrors.Salary = 'Salary must be a positive number';

    if (!initial.DepartmentId) tempErrors.DepartmentId = 'Please select a Department';

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      FirstName: initial.FirstName.trim(),
      LastName: initial.LastName.trim(),
      Email: initial.Email.trim(),
      DOB: new Date(initial.DOB).toISOString().split('T')[0],
      Salary: parseFloat(initial.Salary),
      DepartmentId: Number(initial.DepartmentId)
    };

    try {
      if (editing) {
        await api.put(`/employees/${initial.EmployeeId}`, payload);
        setEditing(false);
      } else {
        await api.post('/employees', payload);
      }
      setInitial({
        EmployeeId: 0,
        FirstName: '',
        LastName: '',
        Email: '',
        DOB: '',
        Salary: '',
        DepartmentId: ''
      });
      loadData();
    } catch (err) {
      console.error('Submit error detail:', err.response?.data || err.message);
      alert('Submission failed: ' + (err.response?.data?.title || err.message));
    }
  };

  const startEdit = (emp) => {
    setInitial({
      EmployeeId: emp.EmployeeId,
      FirstName: emp.FirstName,
      LastName: emp.LastName,
      Email: emp.Email,
      DOB: emp.DOB.split('T')[0],
      Salary: emp.Salary,
      DepartmentId: emp.DepartmentId
    });
    setErrors({});
    setEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      loadData();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data || err.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 5, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" fontWeight="bold" color="primary" gutterBottom>
          Employee Management
        </Typography>

        <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#ffffffee' }}>
          <Typography variant="h6" mb={2} fontWeight="600">
            {editing ? 'Update Employee' : 'Add New Employee'}
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={initial.FirstName}
                  onChange={(e) => handleChange('FirstName', e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!errors.FirstName}
                  helperText={errors.FirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={initial.LastName}
                  onChange={(e) => handleChange('LastName', e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!errors.LastName}
                  helperText={errors.LastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  value={initial.Email}
                  onChange={(e) => handleChange('Email', e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!errors.Email}
                  helperText={errors.Email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={initial.DOB}
                  onChange={(e) => handleChange('DOB', e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  error={!!errors.DOB}
                  helperText={errors.DOB}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salary"
                  type="number"
                  value={initial.Salary}
                  onChange={(e) => handleChange('Salary', e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.01 }}
                  error={!!errors.Salary}
                  helperText={errors.Salary}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required variant="outlined" sx={{ minWidth: 240 }} error={!!errors.DepartmentId}>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department-select"
                    value={initial.DepartmentId || ''}
                    onChange={(e) => handleChange('DepartmentId', e.target.value)}
                    input={<OutlinedInput label="Department" />}
                  >
                    <MenuItem value="">-- Select Department --</MenuItem>
                    {departments.map((d) => (
                      <MenuItem key={d.departmentId} value={d.departmentId}>
                        {d.departmentName} ({d.departmentCode})
                      </MenuItem>
                    ))}
                  </Select>
                  {!!errors.DepartmentId && <FormHelperText>{errors.DepartmentId}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button type="submit" variant="contained" color="primary">
                {editing ? 'Update Employee' : 'Add Employee'}
              </Button>
              {editing && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEditing(false);
                    setInitial({
                      EmployeeId: 0,
                      FirstName: '',
                      LastName: '',
                      Email: '',
                      DOB: '',
                      Salary: '',
                      DepartmentId: ''
                    });
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </form>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="600">
            Employee List
          </Typography>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow
                    key={emp.EmployeeId}
                    hover
                    sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                  >
                    <TableCell>{emp.FirstName} {emp.LastName}</TableCell>
                    <TableCell>{emp.Email}</TableCell>
                    <TableCell>{new Date(emp.DOB).toLocaleDateString()}</TableCell>
                    <TableCell>{calculateAge(emp.DOB)}</TableCell>
                    <TableCell>{emp.Salary}</TableCell>
                    <TableCell>{emp.DepartmentName} ({emp.DepartmentCode})</TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => startEdit(emp)}>Edit</Button>
                      <Button
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                        onClick={() => handleDelete(emp.EmployeeId)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}
