namespace QuizzAPI.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using QuizzAPI.Data;
    using QuizzAPI.Data.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    [ApiController]
    [Route("api/questions/{id:int?}")]
    public class QuestionsController : ControllerBase
    {
        private readonly QuizDbContext context;

        public QuestionsController(QuizDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public IEnumerable<Question> GetByCategory(int id = 0)
        {
            var rng = new Random();
            return this.context.Questions.Where(x => x.CategoryId == id).OrderBy(x => Guid.NewGuid()).ToList();
        }
    }
}
