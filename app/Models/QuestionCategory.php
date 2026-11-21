<?php

namespace App\Models;

use Database\Factories\QuestionCategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class QuestionCategory extends Model
{
    /** @use HasFactory<QuestionCategoryFactory> */
    use HasFactory;

    /** @return HasMany<Question, $this> */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'category_id');
    }
}
