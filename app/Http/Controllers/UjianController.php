<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExamRequest;
use App\Http\Requests\QuestionRequest;
use App\Http\Requests\StoreQuestionCategoryRequest;
use App\Models\Exam;
use App\Models\Question;
use App\Models\QuestionCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class UjianController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('monitoring/Ujian', [
            'categories' => QuestionCategory::query()
                ->withCount('questions')
                ->orderBy('name')
                ->get(),
            'questions' => Question::query()
                ->with('category:id,name')
                ->latest()
                ->get()
                ->map(static fn (Question $question): array => [
                    'id' => $question->id,
                    'category_id' => $question->category_id,
                    'category_name' => $question->category->name,
                    'question_text' => $question->question_text,
                    'options' => [
                        ['key' => 'a', 'text' => $question->option_a],
                        ['key' => 'b', 'text' => $question->option_b],
                        ['key' => 'c', 'text' => $question->option_c],
                        ['key' => 'd', 'text' => $question->option_d],
                    ],
                    'correct_option' => $question->correct_option,
                    'image_url' => $question->image_path
                        ? Storage::disk('public')->url($question->image_path)
                        : null,
                ]),
            'exams' => Exam::query()
                ->withCount('questions')
                ->with('questions:id')
                ->latest()
                ->get()
                ->map(static fn (Exam $exam): array => [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'description' => $exam->description,
                    'questions_count' => $exam->questions_count,
                    'question_ids' => $exam->questions
                        ->pluck('id')
                        ->map(static fn ($id): int => (int) $id)
                        ->all(),
                ]),
        ]);
    }

    public function storeCategory(StoreQuestionCategoryRequest $request): RedirectResponse
    {
        QuestionCategory::create($request->validated());

        return to_route('monitoring.ujian.index');
    }

    public function storeQuestion(QuestionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $attributes = Arr::except($validated, ['image', 'remove_image']);
        $image = $request->file('image');

        if ($image !== null) {
            $imagePath = $image->store('questions', 'public');

            if ($imagePath === false) {
                throw new RuntimeException('The question image could not be stored.');
            }

            $attributes['image_path'] = $imagePath;
        }

        Question::create($attributes);

        return to_route('monitoring.ujian.index');
    }

    public function updateQuestion(QuestionRequest $request, Question $question): RedirectResponse
    {
        $validated = $request->validated();
        $attributes = Arr::except($validated, ['image', 'remove_image']);
        $previousImagePath = $question->image_path;
        $image = $request->file('image');

        if ($image !== null) {
            $imagePath = $image->store('questions', 'public');

            if ($imagePath === false) {
                throw new RuntimeException('The question image could not be stored.');
            }

            $attributes['image_path'] = $imagePath;
        } elseif ($validated['remove_image'] ?? false) {
            $attributes['image_path'] = null;
        }

        $question->update($attributes);

        if ($previousImagePath !== null && array_key_exists('image_path', $attributes)) {
            $this->deleteStoredImage($previousImagePath);
        }

        return to_route('monitoring.ujian.index');
    }

    public function destroyQuestion(Question $question): RedirectResponse
    {
        $imagePath = $question->image_path;
        $question->delete();

        if ($imagePath !== null) {
            $this->deleteStoredImage($imagePath);
        }

        return to_route('monitoring.ujian.index');
    }

    public function storeExam(ExamRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated): void {
            $exam = Exam::create(Arr::only($validated, ['title', 'description']));
            $this->syncExamQuestions($exam, $validated['question_ids']);
        });

        return to_route('monitoring.ujian.index');
    }

    public function updateExam(ExamRequest $request, Exam $exam): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($exam, $validated): void {
            $exam->update(Arr::only($validated, ['title', 'description']));
            $this->syncExamQuestions($exam, $validated['question_ids']);
        });

        return to_route('monitoring.ujian.index');
    }

    public function destroyExam(Exam $exam): RedirectResponse
    {
        $exam->delete();

        return to_route('monitoring.ujian.index');
    }

    /**
     * @param  array<int, mixed>  $questionIds
     */
    private function syncExamQuestions(Exam $exam, array $questionIds): void
    {
        $questions = [];

        foreach ($questionIds as $position => $questionId) {
            $questions[(int) $questionId] = ['position' => $position];
        }

        $exam->questions()->sync($questions);
    }

    private function deleteStoredImage(string $imagePath): void
    {
        if (! Storage::disk('public')->delete($imagePath)) {
            throw new RuntimeException('The question image could not be deleted.');
        }
    }
}
