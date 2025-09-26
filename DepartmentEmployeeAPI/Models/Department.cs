using System.ComponentModel.DataAnnotations;

namespace DepartmentEmployeeAPI.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }

        [Required]
        public string DepartmentCode { get; set; } = null!;  // ✅ must exist

        [Required]
        public string DepartmentName { get; set; } = null!;  // ✅ must exist
    }
}
