using AIRecruiter.Core.DTOs;
using AIRecruiter.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AIRecruiter.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class JobDescriptionsController : ControllerBase
{
    private readonly IJobDescriptionRepository _jobDescriptionRepo;

    public JobDescriptionsController(IJobDescriptionRepository jobDescriptionRepo)
    {
        _jobDescriptionRepo = jobDescriptionRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _jobDescriptionRepo.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _jobDescriptionRepo.GetByIdAsync(id);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJobDescriptionDto dto)
    {
        var result = await _jobDescriptionRepo.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }
}