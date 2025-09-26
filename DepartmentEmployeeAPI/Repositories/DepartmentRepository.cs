using DepartmentEmployeeAPI.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DepartmentEmployeeAPI.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly string _connStr;
        public DepartmentRepository(IConfiguration configuration)
        {
            _connStr = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<int> CreateAsync(Department dept)
        {
            var sql = "INSERT INTO Departments (DepartmentCode, DepartmentName) VALUES (@code,@name); SELECT SCOPE_IDENTITY();";
            using var conn = new SqlConnection(_connStr);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@code", dept.DepartmentCode);
            cmd.Parameters.AddWithValue("@name", dept.DepartmentName);
            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Departments WHERE DepartmentId = @id";
            using var conn = new SqlConnection(_connStr);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@id", id);
            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            var list = new List<Department>();
            var sql = "SELECT DepartmentId, DepartmentCode, DepartmentName FROM Departments ORDER BY DepartmentName";
            using var conn = new SqlConnection(_connStr);
            using var cmd = new SqlCommand(sql, conn);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new Department
                {
                    DepartmentId = reader.GetInt32(0),
                    DepartmentCode = reader.GetString(1),
                    DepartmentName = reader.GetString(2)
                });
            }
            return list;
        }

        public async Task<Department> GetByIdAsync(int id)
        {
            var sql = "SELECT DepartmentId, DepartmentCode, DepartmentName FROM Departments WHERE DepartmentId = @id";
            using var conn = new SqlConnection(_connStr);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@id", id);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Department
                {
                    DepartmentId = reader.GetInt32(0),
                    DepartmentCode = reader.GetString(1),
                    DepartmentName = reader.GetString(2)
                };
            }
            return null;
        }

        public async Task<bool> UpdateAsync(Department dept)
        {
            var sql = "UPDATE Departments SET DepartmentCode = @code, DepartmentName = @name WHERE DepartmentId = @id";
            using var conn = new SqlConnection(_connStr);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@code", dept.DepartmentCode);
            cmd.Parameters.AddWithValue("@name", dept.DepartmentName);
            cmd.Parameters.AddWithValue("@id", dept.DepartmentId);
            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }
    }
}
