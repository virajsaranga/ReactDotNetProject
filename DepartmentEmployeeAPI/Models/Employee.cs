using System;
using System.ComponentModel.DataAnnotations;

namespace DepartmentEmployeeAPI.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public DateTime DOB { get; set; }

        // server will compute Age
        public int Age { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Salary must be non-negative")]
        public decimal Salary { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        public string? DepartmentName { get; set; }
        public string? DepartmentCode { get; set; }
    }
}
