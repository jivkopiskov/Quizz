namespace QuizzAPI.Controllers
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using QuizzAPI.Data;
    using QuizzAPI.Data.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly QuizDbContext context;

        public CategoriesController(QuizDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public IEnumerable<Category> GetAll(string str)
        {
            return context.Categories.ToList();
        }
    }

}
