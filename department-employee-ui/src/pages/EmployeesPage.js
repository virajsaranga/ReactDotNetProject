
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
    employeeId: 0,
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    salary: '',
    departmentId: ''
  });

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

      // Normalize departments to camelCase
      const deptData = deptRes.data.map(d => ({
        departmentId: d.DepartmentId,
        departmentName: d.DepartmentName,
        departmentCode: d.DepartmentCode
      }));
      setDepartments(deptData);

      // Normalize employees to camelCase
      const empData = empRes.data.map(e => ({
        employeeId: e.EmployeeId,
        firstName: e.FirstName,
        lastName: e.LastName,
        email: e.Email,
        dob: e.DOB,
        salary: e.Salary,
        departmentId: e.DepartmentId,
        departmentName: e.DepartmentName || null,
        departmentCode: e.DepartmentCode || null
      }));
      setEmployees(empData);

    } catch (err) {
      console.error('Error loading data:', err);
      alert(err.response?.data || err.message);
    }
  };

  const handleChange = (field, value) => {
    setInitial((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!initial.firstName.trim()) tempErrors.firstName = 'First name is required';
    if (!initial.lastName.trim()) tempErrors.lastName = 'Last name is required';

    if (!initial.email.trim()) tempErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initial.email))
      tempErrors.email = 'Email is invalid';

    if (!initial.dob) tempErrors.dob = 'Date of Birth is required';
    else if (isNaN(new Date(initial.dob).getTime()))
      tempErrors.dob = 'Invalid Date of Birth';

    if (!initial.salary) tempErrors.salary = 'Salary is required';
    else if (isNaN(parseFloat(initial.salary)) || parseFloat(initial.salary) <= 0)
      tempErrors.salary = 'Salary must be a positive number';

    if (!initial.departmentId) tempErrors.departmentId = 'Please select a Department';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      FirstName: initial.firstName.trim(),
      LastName: initial.lastName.trim(),
      Email: initial.email.trim(),
      DOB: new Date(initial.dob).toISOString().split('T')[0],
      Salary: parseFloat(initial.salary),
      DepartmentId: Number(initial.departmentId)
    };

    try {
      if (editing) {
        await api.put(`/employees/${initial.employeeId}`, payload);
        setEditing(false);
      } else {
        await api.post('/employees', payload);
      }
      setInitial({
        employeeId: 0,
        firstName: '',
        lastName: '',
        email: '',
        dob: '',
        salary: '',
        departmentId: ''
      });
      loadData();
    } catch (err) {
      console.error('Submit error detail:', err.response?.data || err.message);
      alert('Submission failed: ' + (err.response?.data?.title || err.message));
    }
  };

  const startEdit = (emp) => {
    setInitial({
      employeeId: emp.employeeId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      dob: emp.dob.split('T')[0],
      salary: emp.salary,
      departmentId: emp.departmentId
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
                  value={initial.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  fullWidth
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={initial.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  fullWidth
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  value={initial.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={initial.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dob}
                  helperText={errors.dob}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salary"
                  type="number"
                  value={initial.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  error={!!errors.salary}
                  helperText={errors.salary}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!errors.departmentId}>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    value={initial.departmentId || ''}
                    onChange={(e) => handleChange('departmentId', e.target.value)}
                    input={<OutlinedInput label="Department" />}
                  >
                    <MenuItem value="">-- Select Department --</MenuItem>
                    {departments.map((d) => (
                      <MenuItem key={d.departmentId} value={d.departmentId}>
                        {d.departmentName} ({d.departmentCode})
                      </MenuItem>
                    ))}
                  </Select>
                  {!!errors.departmentId && <FormHelperText>{errors.departmentId}</FormHelperText>}
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
                      employeeId: 0,
                      firstName: '',
                      lastName: '',
                      email: '',
                      dob: '',
                      salary: '',
                      departmentId: ''
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
                {employees.map((emp) => {
                  const dept = departments.find(d => d.departmentId === emp.departmentId);
                  return (
                    <TableRow key={emp.employeeId} hover>
                      <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{new Date(emp.dob).toLocaleDateString()}</TableCell>
                      <TableCell>{calculateAge(emp.dob)}</TableCell>
                      <TableCell>{emp.salary}</TableCell>
                      <TableCell>
                        {dept ? `${dept.departmentName} (${dept.departmentCode})` : '—'}
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" onClick={() => startEdit(emp)}>Edit</Button>
                        <Button
                          size="small"
                          color="error"
                          sx={{ ml: 1 }}
                          onClick={() => handleDelete(emp.employeeId)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}

