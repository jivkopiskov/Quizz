namespace QuizzAPI.Data.Seeding
{
    using QuizzAPI.Data.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class CategorySeeder : ISeeder
    {
        public async Task SeedAsync(QuizDbContext dbContext, IServiceProvider serviceProvider)
        {
            if (dbContext.Categories.Any())
            {
                return;
            }
            
            await dbContext.Categories.AddAsync(new Category() { Name = "Sports"});
            await dbContext.Categories.AddAsync(new Category() { Name = "Art"});
            await dbContext.Categories.AddAsync(new Category() { Name = "History"});
            await dbContext.Categories.AddAsync(new Category() { Name = "Technology"});
            await dbContext.Categories.AddAsync(new Category() { Name = "Animals"});
        }
    }
}
