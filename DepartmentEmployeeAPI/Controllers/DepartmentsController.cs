using DepartmentEmployeeAPI.Models;
using DepartmentEmployeeAPI.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DepartmentEmployeeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentRepository _repo;
        public DepartmentsController(IDepartmentRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var d = await _repo.GetByIdAsync(id);
            if (d == null) return NotFound();
            return Ok(d);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Department dept)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var id = await _repo.CreateAsync(dept);
            return CreatedAtAction(nameof(Get), new { id }, dept);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Department dept)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            dept.DepartmentId = id;
            var ok = await _repo.UpdateAsync(dept);
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
