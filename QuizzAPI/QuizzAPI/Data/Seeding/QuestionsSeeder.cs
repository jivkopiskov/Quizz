namespace QuizzAPI.Data.Seeding
{
    using QuizzAPI.Data.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class QuestionsSeeder : ISeeder
    {
        public async Task SeedAsync(QuizDbContext dbContext, IServiceProvider serviceProvider)
        {
            if (dbContext.Questions.Any())
            {
                return;
            }

            var categories = dbContext.Categories.ToList();
            foreach (var category in categories)
            {
                for (int i = 0; i < 50; i++)
                {
                    var question = new Question { CategoryId = category.Id, Text = $"{category.Name}: Question # {i + 1}" };
                    question.Answers.Add(new Answer { IsCorrect = i % 4 == 0, Text = "Sample answer" });
                    question.Answers.Add(new Answer { IsCorrect = i % 4 == 1, Text = "Sample answer" });
                    question.Answers.Add(new Answer { IsCorrect = i % 4 == 2, Text = "Sample answer" });
                    question.Answers.Add(new Answer { IsCorrect = i % 4 == 3, Text = "Sample answer" });
                    question.Answers.FirstOrDefault(x => x.IsCorrect).Text = "Correct answer";

                    await dbContext.AddAsync(question);
                }
            }
        }
    }
}