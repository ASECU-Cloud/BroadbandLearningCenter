<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\QuestionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => QuestionCategory::factory(),
            'question_text' => fake()->sentence(),
            'option_a' => fake()->word(),
            'option_b' => fake()->word(),
            'option_c' => fake()->word(),
            'option_d' => fake()->word(),
            'correct_option' => fake()->randomElement(['a', 'b', 'c', 'd']),
            'image_path' => null,
        ];
    }
}
