<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Question;
use App\Models\QuestionCategory;
use Illuminate\Database\Seeder;

class UjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = QuestionCategory::firstOrCreate([
            'name' => 'Dasar Jaringan',
        ]);

        $question = Question::firstOrCreate(
            ['question_text' => 'Perangkat apa yang digunakan untuk menghubungkan beberapa jaringan?'],
            [
                'category_id' => $category->id,
                'option_a' => 'Router',
                'option_b' => 'Monitor',
                'option_c' => 'Keyboard',
                'option_d' => 'Printer',
                'correct_option' => 'a',
            ],
        );

        $exam = Exam::firstOrCreate(
            ['title' => 'Ujian Dasar Jaringan'],
            ['description' => 'Contoh ujian yang dapat diedit dari halaman Ujian.'],
        );

        $exam->questions()->syncWithoutDetaching([
            $question->id => ['position' => 0],
        ]);
    }
}
