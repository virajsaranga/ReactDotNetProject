import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [initial, setInitial] = useState({
    departmentId: 0,
    departmentName: '',
    departmentCode: ''
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Error loading departments:', err);
      alert(err.response?.data || err.message);
    }
  };

  const handleChange = (field, value) => {
    setInitial({ ...initial, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initial.departmentName || !initial.departmentCode) {
      return alert('Both fields are required');
    }

    const payload = {
      departmentName: initial.departmentName.trim(),
      departmentCode: initial.departmentCode.trim()
    };

    try {
      if (editing) {
        await api.put(`/departments/${initial.departmentId}`, payload);
        setEditing(false);
      } else {
        await api.post('/departments', payload);
      }

      setInitial({ departmentId: 0, departmentName: '', departmentCode: '' });
      loadDepartments();
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.response?.data?.title || err.message);
    }
  };

  const startEdit = (dept) => {
    setInitial({
      departmentId: dept.departmentId,
      departmentName: dept.departmentName,
      departmentCode: dept.departmentCode
    });
    setEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      loadDepartments();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data || err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3} align="center">
        Departments
      </Typography>

      {/* Department Form */}
      <Paper sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Department Name"
            value={initial.departmentName}
            onChange={(e) => handleChange('departmentName', e.target.value)}
            fullWidth margin="normal" required
          />
          <TextField
            label="Department Code"
            value={initial.departmentCode}
            onChange={(e) => handleChange('departmentCode', e.target.value)}
            fullWidth margin="normal" required
          />

          <Box mt={2} display="flex" justifyContent="flex-start" gap={2}>
            <Button type="submit" variant="contained" color="primary">
              {editing ? 'Update Department' : 'Add Department'}
            </Button>
            {editing && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditing(false);
                  setInitial({ departmentId: 0, departmentName: '', departmentCode: '' });
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Department Table */}
      <Paper sx={{ p: 2, boxShadow: 2, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.departmentId}>
                <TableCell>{dept.departmentName}</TableCell>
                <TableCell>{dept.departmentCode}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => startEdit(dept)}>Edit</Button>
                  <Button
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleDelete(dept.departmentId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
