using DepartmentEmployeeAPI.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DepartmentEmployeeAPI.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly string _connStr;
        public EmployeeRepository(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private static int CalculateAge(DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;
            if (dob > today.AddYears(-age)) age--;
            return age;
        }

        public async Task<int> CreateAsync(Employee emp)
        {
            const string sql = @"
INSERT INTO dbo.Employees (FirstName, LastName, Email, DOB, Salary, DepartmentId)
VALUES (@first, @last, @email, @dob, @salary, @dept);
SELECT SCOPE_IDENTITY();";

            await using var conn = new SqlConnection(_connStr);
            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@first", emp.FirstName);
            cmd.Parameters.AddWithValue("@last", emp.LastName);
            cmd.Parameters.AddWithValue("@email", emp.Email);
            cmd.Parameters.AddWithValue("@dob", emp.DOB.Date);
            cmd.Parameters.AddWithValue("@salary", emp.Salary);
            cmd.Parameters.AddWithValue("@dept", emp.DepartmentId);
            await conn.OpenAsync();
            var scalar = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(scalar);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = "DELETE FROM dbo.Employees WHERE EmployeeId = @id";
            await using var conn = new SqlConnection(_connStr);
            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@id", id);
            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            var list = new List<Employee>();
            const string sql = @"
SELECT e.EmployeeId, e.FirstName, e.LastName, e.Email, e.DOB, e.Salary, e.DepartmentId, d.DepartmentName, d.DepartmentCode
FROM dbo.Employees e
LEFT JOIN dbo.Departments d ON e.DepartmentId = d.DepartmentId
ORDER BY e.FirstName, e.LastName";

            await using var conn = new SqlConnection(_connStr);
            await using var cmd = new SqlCommand(sql, conn);
            await conn.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var dob = reader.GetDateTime(4);
                var emp = new Employee
                {
                    EmployeeId = reader.GetInt32(0),
                    FirstName = reader.GetString(1),
                    LastName = reader.GetString(2),
                    Email = reader.GetString(3),
                    DOB = dob,
                    Salary = reader.GetDecimal(5),
                    DepartmentId = reader.GetInt32(6),
                    DepartmentName = reader.IsDBNull(7) ? null : reader.GetString(7),
                    DepartmentCode = reader.IsDBNull(8) ? null : reader.GetString(8)
                };
                emp.Age = CalculateAge(emp.DOB);
                list.Add(emp);
            }

            return list;
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            const string sql = @"
SELECT e.EmployeeId, e.FirstName, e.LastName, e.Email, e.DOB, e.Salary, e.DepartmentId, d.DepartmentName, d.DepartmentCode
FROM dbo.Employees e
LEFT JOIN dbo.Departments d ON e.DepartmentId = d.DepartmentId
WHERE e.EmployeeId = @id";

            await using var conn = new SqlConnection(_connStr);
            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@id", id);
            await conn.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var dob = reader.GetDateTime(4);
                var emp = new Employee
                {
                    EmployeeId = reader.GetInt32(0),
                    FirstName = reader.GetString(1),
                    LastName = reader.GetString(2),
                    Email = reader.GetString(3),
                    DOB = dob,
                    Salary = reader.GetDecimal(5),
                    DepartmentId = reader.GetInt32(6),
                    DepartmentName = reader.IsDBNull(7) ? null : reader.GetString(7),
                    DepartmentCode = reader.IsDBNull(8) ? null : reader.GetString(8)
                };
                emp.Age = CalculateAge(emp.DOB);
                return emp;
            }
            return null;
        }

        public async Task<bool> UpdateAsync(Employee emp)
        {
            const string sql = @"
UPDATE dbo.Employees
SET FirstName = @first, LastName = @last, Email = @email, DOB = @dob, Salary = @salary, DepartmentId = @dept
WHERE EmployeeId = @id";

            await using var conn = new SqlConnection(_connStr);
            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@first", emp.FirstName);
            cmd.Parameters.AddWithValue("@last", emp.LastName);
            cmd.Parameters.AddWithValue("@email", emp.Email);
            cmd.Parameters.AddWithValue("@dob", emp.DOB.Date);
            cmd.Parameters.AddWithValue("@salary", emp.Salary);
            cmd.Parameters.AddWithValue("@dept", emp.DepartmentId);
            cmd.Parameters.AddWithValue("@id", emp.EmployeeId);
            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }
    }
}
