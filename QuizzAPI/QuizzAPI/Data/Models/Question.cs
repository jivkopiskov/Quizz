namespace QuizzAPI.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class Question
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Text { get; set; }

        public Category Category { get; set; }

        public int CategoryId { get; set; }

        public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
    }
}