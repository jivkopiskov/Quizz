namespace QuizzAPI.Data.Seeding
{
    using System;
    using System.Threading.Tasks;

    public interface ISeeder
    {
        Task SeedAsync(QuizDbContext dbContext, IServiceProvider serviceProvider);
    }
}
