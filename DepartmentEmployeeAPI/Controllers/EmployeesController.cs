using DepartmentEmployeeAPI.Models;
using DepartmentEmployeeAPI.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DepartmentEmployeeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;
        public EmployeesController(IEmployeeRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var emp = await _repo.GetByIdAsync(id);
            if (emp == null) return NotFound();
            return Ok(emp);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Employee emp)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var newId = await _repo.CreateAsync(emp);
            return CreatedAtAction(nameof(Get), new { id = newId }, emp);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Employee emp)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            emp.EmployeeId = id;
            var ok = await _repo.UpdateAsync(emp);
            return ok ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _repo.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}
