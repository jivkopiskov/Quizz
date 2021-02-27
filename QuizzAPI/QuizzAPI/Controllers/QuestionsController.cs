namespace QuizzAPI.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using QuizzAPI.Data;
    using QuizzAPI.Data.Models;
    using QuizzAPI.Dto;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    [ApiController]
    [Route("api/questions")]
    public class QuestionsController : ControllerBase
    {
        private readonly QuizDbContext context;

        public QuestionsController(QuizDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        [Route("{id:int?}")]
        [Route("test/{id:int?}")]
        public IEnumerable<QuestionDto> GetByCategory(int id = 1, [FromQuery]List<int> exclude = null)
        {
            var rng = new Random();
            if (exclude == null)
            {
                exclude = new List<int>();
            }
            var test = this.context.Questions
                .Where(x => x.CategoryId == id && !exclude.Contains(x.Id))
                .Select(x => new QuestionDto
                {
                    Id = x.Id,
                    Text = x.Text,
                    Answers = x.Answers.Select(a => new AnswerDto { Text = a.Text, IsCorrect = a.IsCorrect })
                })
                .ToList()
                .OrderBy(x => Guid.NewGuid())
                .Take(5);

            return test.ToList();
        }
    }
}
