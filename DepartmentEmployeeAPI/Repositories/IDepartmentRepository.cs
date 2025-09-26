using DepartmentEmployeeAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DepartmentEmployeeAPI.Repositories
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllAsync();
        Task<Department> GetByIdAsync(int id);
        Task<int> CreateAsync(Department dept);
        Task<bool> UpdateAsync(Department dept);
        Task<bool> DeleteAsync(int id);
    }
}
