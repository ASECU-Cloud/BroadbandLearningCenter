<?php

namespace App\Models;

use Database\Factories\QuestionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'category_id',
    'question_text',
    'option_a',
    'option_b',
    'option_c',
    'option_d',
    'correct_option',
    'image_path',
])]
class Question extends Model
{
    /** @use HasFactory<QuestionFactory> */
    use HasFactory;

    /** @return BelongsTo<QuestionCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(QuestionCategory::class, 'category_id');
    }

    /** @return BelongsToMany<Exam, $this> */
    public function exams(): BelongsToMany
    {
        return $this->belongsToMany(Exam::class)
            ->withPivot('position')
            ->orderByPivot('position');
    }
}
