<?php

use App\Models\Exam;
use App\Models\Question;
use App\Models\QuestionCategory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function pngUpload(string $name): UploadedFile
{
    $image = base64_decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC',
    );

    return UploadedFile::fake()->createWithContent($name, $image);
}

test('the Ujian page lists categories, questions, and exams', function () {
    $category = QuestionCategory::factory()->create();
    $question = Question::factory()->for($category, 'category')->create();
    $exam = Exam::factory()->create();
    $exam->questions()->attach($question, ['position' => 0]);

    $this->get(route('monitoring.ujian.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('monitoring/Ujian')
            ->has('categories', 1)
            ->has('questions', 1)
            ->has('exams', 1));
});

test('a category can be added', function () {
    $this->post(route('monitoring.ujian.categories.store'), [
        'name' => 'Keselamatan',
    ])->assertRedirect(route('monitoring.ujian.index'));

    $category = QuestionCategory::query()
        ->where('name', 'Keselamatan')
        ->firstOrFail();

    $this->assertModelExists($category);
});

test('a question can be created with an image and a category', function () {
    Storage::fake('public');
    $category = QuestionCategory::factory()->create();

    $this->post(route('monitoring.ujian.questions.store'), [
        'category_id' => $category->id,
        'question_text' => 'Which device routes traffic between networks?',
        'option_a' => 'Router',
        'option_b' => 'Switch',
        'option_c' => 'Monitor',
        'option_d' => 'Printer',
        'correct_option' => 'a',
        'image' => pngUpload('network.png'),
    ])->assertRedirect(route('monitoring.ujian.index'));

    $question = Question::query()->firstOrFail();

    expect($question->category_id)->toBe($category->id)
        ->and($question->image_path)->not->toBeNull();

    Storage::disk('public')->assertExists($question->image_path);
});

test('a question can be edited and its image removed', function () {
    Storage::fake('public');
    $originalCategory = QuestionCategory::factory()->create();
    $newCategory = QuestionCategory::factory()->create();
    $question = Question::factory()->for($originalCategory, 'category')->create([
        'image_path' => 'questions/original.png',
    ]);
    Storage::disk('public')->put($question->image_path, 'image');

    $this->patch(route('monitoring.ujian.questions.update', $question), [
        'category_id' => $newCategory->id,
        'question_text' => 'Updated question',
        'option_a' => 'First',
        'option_b' => 'Second',
        'option_c' => 'Third',
        'option_d' => 'Fourth',
        'correct_option' => 'b',
        'remove_image' => true,
    ])->assertRedirect(route('monitoring.ujian.index'));

    $question->refresh();

    expect($question->category_id)->toBe($newCategory->id)
        ->and($question->question_text)->toBe('Updated question')
        ->and($question->correct_option)->toBe('b')
        ->and($question->image_path)->toBeNull();

    Storage::disk('public')->assertMissing('questions/original.png');
});

test('an exam can be created and updated with ordered questions', function () {
    $questions = Question::factory()->count(2)->create();

    $this->post(route('monitoring.ujian.exams.store'), [
        'title' => 'Network Basics',
        'description' => 'Initial assessment',
        'question_ids' => [$questions[1]->id, $questions[0]->id],
    ])->assertRedirect(route('monitoring.ujian.index'));

    $exam = Exam::query()->firstOrFail();

    expect($exam->questions->pluck('id')->all())
        ->toBe([$questions[1]->id, $questions[0]->id]);

    $this->patch(route('monitoring.ujian.exams.update', $exam), [
        'title' => 'Updated Network Basics',
        'description' => '',
        'question_ids' => [$questions[0]->id],
    ])->assertRedirect(route('monitoring.ujian.index'));

    $exam->refresh();

    expect($exam->title)->toBe('Updated Network Basics')
        ->and($exam->questions->pluck('id')->all())->toBe([$questions[0]->id]);
});

test('an exam cannot reference questions that do not exist', function () {
    $this->from(route('monitoring.ujian.index'))
        ->post(route('monitoring.ujian.exams.store'), [
            'title' => 'Invalid exam',
            'description' => '',
            'question_ids' => [999999],
        ])
        ->assertSessionHasErrors('question_ids.0');

    expect(Exam::query()->count())->toBe(0);
});
