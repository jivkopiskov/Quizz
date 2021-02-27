﻿namespace QuizzAPI.Dto
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class QuestionDto
    {
        public int Id { get; set; }
        public string Text { get; set; }

        public IEnumerable<AnswerDto> Answers { get; set; }

    }
}
