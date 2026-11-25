import { router, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

import {
    destroyExam,
    destroyQuestion,
    storeCategory,
    storeExam,
    storeQuestion,
    updateExam,
    updateQuestion,
} from '@/actions/App/Http/Controllers/UjianController';
import Sidebar from '@/components/Sidebar';

type Category = {
    id: number;
    name: string;
    questions_count: number;
};

type OptionKey = 'a' | 'b' | 'c' | 'd';

type QuestionRecord = {
    id: number;
    category_id: number;
    category_name: string;
    question_text: string;
    options: { key: OptionKey; text: string }[];
    correct_option: OptionKey;
    image_url: string | null;
};

type ExamRecord = {
    id: number;
    title: string;
    description: string | null;
    questions_count: number;
    question_ids: number[];
};

type UjianProps = {
    categories: Category[];
    questions: QuestionRecord[];
    exams: ExamRecord[];
};

type QuestionFormData = {
    category_id: number | '';
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: OptionKey;
    image: File | null;
    remove_image: boolean;
};

type ExamFormData = {
    title: string;
    description: string;
    question_ids: number[];
};

const optionKeys: OptionKey[] = ['a', 'b', 'c', 'd'];

function ErrorMessage({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return (
        <p className="mt-1 text-sm text-rose-600" role="alert">
            {message}
        </p>
    );
}

function FormLabel({
    htmlFor,
    children,
}: {
    htmlFor: string;
    children: ReactNode;
}) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-1.5 block text-sm font-medium text-slate-700"
        >
            {children}
        </label>
    );
}

export default function Ujian({ categories, questions, exams }: UjianProps) {
    const [activeTab, setActiveTab] = useState<'questions' | 'exams'>(
        'questions',
    );
    const [query, setQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [examDialogOpen, setExamDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] =
        useState<QuestionRecord | null>(null);
    const [editingExam, setEditingExam] = useState<ExamRecord | null>(null);

    const categoryForm = useForm({ name: '' });
    const questionForm = useForm<QuestionFormData>({
        category_id: '',
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'a',
        image: null,
        remove_image: false,
    });
    const examForm = useForm<ExamFormData>({
        title: '',
        description: '',
        question_ids: [],
    });

    const filteredQuestions = useMemo(() => {
        const search = query.trim().toLowerCase();

        return questions.filter((question) => {
            const matchesSearch =
                !search ||
                `${question.question_text} ${question.category_name}`
                    .toLowerCase()
                    .includes(search);
            const matchesCategory =
                categoryFilter === 'all' ||
                question.category_id === Number(categoryFilter);

            return matchesSearch && matchesCategory;
        });
    }, [categoryFilter, query, questions]);

    const filteredExams = useMemo(() => {
        const search = query.trim().toLowerCase();

        return exams.filter((exam) =>
            `${exam.title} ${exam.description ?? ''}`
                .toLowerCase()
                .includes(search),
        );
    }, [exams, query]);

    function openNewQuestion() {
        questionForm.transform((data) => data);
        questionForm.reset();
        questionForm.clearErrors();
        setEditingQuestion(null);
        setQuestionDialogOpen(true);
    }

    function openQuestionEditor(question: QuestionRecord) {
        questionForm.transform((data) => data);
        questionForm.clearErrors();
        questionForm.setData({
            category_id: question.category_id,
            question_text: question.question_text,
            option_a: question.options[0]?.text ?? '',
            option_b: question.options[1]?.text ?? '',
            option_c: question.options[2]?.text ?? '',
            option_d: question.options[3]?.text ?? '',
            correct_option: question.correct_option,
            image: null,
            remove_image: false,
        });
        setEditingQuestion(question);
        setQuestionDialogOpen(true);
    }

    function closeQuestionDialog() {
        questionForm.transform((data) => data);
        questionForm.reset();
        questionForm.clearErrors();
        setEditingQuestion(null);
        setQuestionDialogOpen(false);
    }

    function submitQuestion(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const onSuccess = () => {
            closeQuestionDialog();
        };

        if (editingQuestion) {
            questionForm.transform((data) => ({ ...data, _method: 'patch' }));
            questionForm.post(updateQuestion.url(editingQuestion.id), {
                forceFormData: true,
                onSuccess,
            });

            return;
        }

        questionForm.post(storeQuestion.url(), {
            forceFormData: true,
            onSuccess,
        });
    }

    function openNewExam() {
        examForm.reset();
        examForm.clearErrors();
        setEditingExam(null);
        setExamDialogOpen(true);
    }

    function openExamEditor(exam: ExamRecord) {
        examForm.clearErrors();
        examForm.setData({
            title: exam.title,
            description: exam.description ?? '',
            question_ids: exam.question_ids,
        });
        setEditingExam(exam);
        setExamDialogOpen(true);
    }

    function closeExamDialog() {
        examForm.reset();
        examForm.clearErrors();
        setEditingExam(null);
        setExamDialogOpen(false);
    }

    function submitExam(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const onSuccess = () => {
            closeExamDialog();
        };

        if (editingExam) {
            examForm.patch(updateExam.url(editingExam.id), { onSuccess });

            return;
        }

        examForm.post(storeExam.url(), { onSuccess });
    }

    function deleteQuestion(question: QuestionRecord) {
        if (window.confirm('Hapus soal ini?')) {
            router.delete(destroyQuestion.url(question.id));
        }
    }

    function deleteExam(exam: ExamRecord) {
        if (window.confirm(`Hapus ujian "${exam.title}"?`)) {
            router.delete(destroyExam.url(exam.id));
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                <Sidebar />

                <main className="min-h-screen min-w-0  py-6 pr-6 ">
                    <div className="mx-auto max-w-7xl">
                        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
                                    Monitoring
                                </p>
                                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                                    Ujian
                                </h1>
                                <p className="mt-2 text-sm text-slate-500">
                                    Kelola bank soal, kategori, dan susunan
                                    ujian.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCategoryDialogOpen(true)}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                Kelola kategori
                            </button>
                        </header>

                        <section className="mb-6 grid gap-4 sm:grid-cols-3">
                            {[
                                {
                                    label: 'Kategori',
                                    value: categories.length,
                                    tone: 'bg-violet-50 text-violet-700',
                                },
                                {
                                    label: 'Total soal',
                                    value: questions.length,
                                    tone: 'bg-sky-50 text-sky-700',
                                },
                                {
                                    label: 'Total ujian',
                                    value: exams.length,
                                    tone: 'bg-emerald-50 text-emerald-700',
                                },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <p className="text-sm text-slate-500">
                                        {stat.label}
                                    </p>
                                    <p
                                        className={`mt-3 inline-flex rounded-lg px-3 py-1 text-2xl font-bold ${stat.tone}`}
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </section>

                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div
                                    className="flex w-fit rounded-lg bg-slate-100 p-1"
                                    role="tablist"
                                    aria-label="Jenis konten ujian"
                                >
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={
                                            activeTab === 'questions'
                                        }
                                        onClick={() => {
                                            setActiveTab('questions');
                                            setQuery('');
                                        }}
                                        className={`rounded-md px-4 py-2 text-sm font-semibold transition ${activeTab === 'questions'
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Bank soal
                                    </button>
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === 'exams'}
                                        onClick={() => {
                                            setActiveTab('exams');
                                            setQuery('');
                                        }}
                                        className={`rounded-md px-4 py-2 text-sm font-semibold transition ${activeTab === 'exams'
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Daftar ujian
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <label
                                        className="sr-only"
                                        htmlFor="ujian-search"
                                    >
                                        Cari
                                    </label>
                                    <input
                                        id="ujian-search"
                                        type="search"
                                        value={query}
                                        onChange={(event) =>
                                            setQuery(event.target.value)
                                        }
                                        placeholder={
                                            activeTab === 'questions'
                                                ? 'Cari soal...'
                                                : 'Cari ujian...'
                                        }
                                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:w-56"
                                    />
                                    {activeTab === 'questions' && (
                                        <label
                                            className="sr-only"
                                            htmlFor="category-filter"
                                        >
                                            Filter kategori
                                        </label>
                                    )}
                                    {activeTab === 'questions' && (
                                        <select
                                            id="category-filter"
                                            value={categoryFilter}
                                            onChange={(event) =>
                                                setCategoryFilter(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        >
                                            <option value="all">
                                                Semua kategori
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    <button
                                        type="button"
                                        onClick={
                                            activeTab === 'questions'
                                                ? openNewQuestion
                                                : openNewExam
                                        }
                                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                                    >
                                        <span aria-hidden="true">+</span>
                                        {activeTab === 'questions'
                                            ? 'Tambah soal'
                                            : 'Buat ujian'}
                                    </button>
                                </div>
                            </div>

                            {activeTab === 'questions' ? (
                                <div className="divide-y divide-slate-100">
                                    {filteredQuestions?.map((question) => (
                                        <article
                                            key={question.id}
                                            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
                                        >
                                            <div className="flex min-w-0 gap-4">
                                                {question.image_url && (
                                                    <img
                                                        src={question.image_url}
                                                        alt="Gambar soal"
                                                        className="h-24 w-28 shrink-0 rounded-lg border border-slate-200 object-cover"
                                                    />
                                                )}
                                                <div className="min-w-0">
                                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                            {
                                                                question.category_name
                                                            }
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            Soal #{question.id}
                                                        </span>
                                                    </div>
                                                    <h2 className="font-semibold whitespace-pre-wrap text-slate-900">
                                                        {question.question_text}
                                                    </h2>
                                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                        {question?.options?.map(
                                                            (option) => (
                                                                <p
                                                                    key={
                                                                        option.key
                                                                    }
                                                                    className={`rounded-md px-3 py-2 text-sm ${option.key ===
                                                                        question.correct_option
                                                                        ? 'bg-emerald-50 font-medium text-emerald-800'
                                                                        : 'bg-slate-50 text-slate-600'
                                                                        }`}
                                                                >
                                                                    <span className="mr-2 font-semibold uppercase">
                                                                        {
                                                                            option.key
                                                                        }
                                                                        .
                                                                    </span>
                                                                    {
                                                                        option.text
                                                                    }
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 gap-2 sm:pl-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openQuestionEditor(
                                                            question,
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteQuestion(question)
                                                    }
                                                    className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                    {filteredQuestions.length === 0 && (
                                        <div className="px-5 py-14 text-center">
                                            <p className="font-medium text-slate-700">
                                                Belum ada soal yang cocok.
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Tambahkan kategori dan soal
                                                untuk mulai membuat bank soal.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-4 p-4 md:grid-cols-2">
                                    {filteredExams.map((exam) => (
                                        <article
                                            key={exam.id}
                                            className="rounded-xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h2 className="font-semibold text-slate-900">
                                                        {exam.title}
                                                    </h2>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {exam.questions_count}{' '}
                                                        soal
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                    Ujian
                                                </span>
                                            </div>
                                            {exam.description && (
                                                <p className="mt-4 line-clamp-3 text-sm text-slate-600">
                                                    {exam.description}
                                                </p>
                                            )}
                                            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openExamEditor(exam)
                                                    }
                                                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Edit ujian
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteExam(exam)
                                                    }
                                                    className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                    {filteredExams.length === 0 && (
                                        <div className="px-5 py-14 text-center md:col-span-2">
                                            <p className="font-medium text-slate-700">
                                                Belum ada ujian.
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Buat ujian dan pilih soal dari
                                                bank soal.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {questionDialogOpen && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                                role="presentation"
                            >
                                <section
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="question-dialog-title"
                                    className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
                                >
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div>
                                            <h2
                                                id="question-dialog-title"
                                                className="text-xl font-semibold text-slate-900"
                                            >
                                                {editingQuestion
                                                    ? 'Edit soal'
                                                    : 'Tambah soal'}
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Isi pertanyaan, pilihan jawaban,
                                                dan kunci jawaban.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={closeQuestionDialog}
                                            aria-label="Tutup formulir soal"
                                            className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={submitQuestion}
                                        className="space-y-5"
                                    >
                                        <div>
                                            <FormLabel htmlFor="question-category">
                                                Kategori
                                            </FormLabel>
                                            <select
                                                id="question-category"
                                                value={
                                                    questionForm.data
                                                        .category_id
                                                }
                                                onChange={(event) =>
                                                    questionForm.setData(
                                                        'category_id',
                                                        event.target.value
                                                            ? Number(
                                                                event.target
                                                                    .value,
                                                            )
                                                            : '',
                                                    )
                                                }
                                                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                required
                                            >
                                                <option value="">
                                                    Pilih kategori
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ErrorMessage
                                                message={
                                                    questionForm.errors
                                                        .category_id
                                                }
                                            />
                                            {categories.length === 0 && (
                                                <p className="mt-2 text-sm text-amber-700">
                                                    Buat kategori terlebih
                                                    dahulu.
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <FormLabel htmlFor="question-text">
                                                Pertanyaan
                                            </FormLabel>
                                            <textarea
                                                id="question-text"
                                                rows={3}
                                                value={
                                                    questionForm.data
                                                        .question_text
                                                }
                                                onChange={(event) =>
                                                    questionForm.setData(
                                                        'question_text',
                                                        event.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                required
                                            />
                                            <ErrorMessage
                                                message={
                                                    questionForm.errors
                                                        .question_text
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {optionKeys.map((key) => {
                                                const field =
                                                    `option_${key}` as const;

                                                return (
                                                    <div key={key}>
                                                        <FormLabel
                                                            htmlFor={`question-option-${key}`}
                                                        >
                                                            Pilihan{' '}
                                                            {key.toUpperCase()}
                                                        </FormLabel>
                                                        <input
                                                            id={`question-option-${key}`}
                                                            value={
                                                                questionForm
                                                                    .data[field]
                                                            }
                                                            onChange={(event) =>
                                                                questionForm.setData(
                                                                    field,
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                            required
                                                        />
                                                        <ErrorMessage
                                                            message={
                                                                questionForm
                                                                    .errors[
                                                                field
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div>
                                            <FormLabel htmlFor="correct-option">
                                                Jawaban benar
                                            </FormLabel>
                                            <select
                                                id="correct-option"
                                                value={
                                                    questionForm.data
                                                        .correct_option
                                                }
                                                onChange={(event) =>
                                                    questionForm.setData(
                                                        'correct_option',
                                                        event.target
                                                            .value as OptionKey,
                                                    )
                                                }
                                                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                            >
                                                {optionKeys.map((key) => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        Pilihan{' '}
                                                        {key.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                            <ErrorMessage
                                                message={
                                                    questionForm.errors
                                                        .correct_option
                                                }
                                            />
                                        </div>

                                        <div>
                                            <FormLabel htmlFor="question-image">
                                                Gambar soal (opsional)
                                            </FormLabel>
                                            {editingQuestion?.image_url && (
                                                <div className="mb-3 flex items-center gap-3">
                                                    <img
                                                        src={
                                                            editingQuestion.image_url
                                                        }
                                                        alt="Gambar soal saat ini"
                                                        className="h-20 w-24 rounded-lg border border-slate-200 object-cover"
                                                    />
                                                    <label className="flex items-center gap-2 text-sm text-slate-600">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                questionForm
                                                                    .data
                                                                    .remove_image
                                                            }
                                                            onChange={(event) =>
                                                                questionForm.setData(
                                                                    'remove_image',
                                                                    event.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        Hapus gambar saat ini
                                                    </label>
                                                </div>
                                            )}
                                            <input
                                                id="question-image"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(event) =>
                                                    questionForm.setData(
                                                        'image',
                                                        event.target
                                                            .files?.[0] ?? null,
                                                    )
                                                }
                                                className="block w-full rounded-lg border border-slate-300 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                                            />
                                            <p className="mt-1 text-xs text-slate-500">
                                                JPG, PNG, atau WEBP hingga 5 MB.
                                            </p>
                                            <ErrorMessage
                                                message={
                                                    questionForm.errors.image
                                                }
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                                            <button
                                                type="button"
                                                onClick={closeQuestionDialog}
                                                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={
                                                    questionForm.processing ||
                                                    categories.length === 0
                                                }
                                                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {questionForm.processing
                                                    ? 'Menyimpan...'
                                                    : 'Simpan soal'}
                                            </button>
                                        </div>
                                    </form>
                                </section>
                            </div>
                        )}

                        {categoryDialogOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                                <section
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="category-dialog-title"
                                    className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
                                >
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div>
                                            <h2
                                                id="category-dialog-title"
                                                className="text-xl font-semibold text-slate-900"
                                            >
                                                Kategori soal
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Kelompokkan soal agar mudah
                                                ditemukan.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCategoryDialogOpen(false)
                                            }
                                            aria-label="Tutup kategori"
                                            className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            categoryForm.post(
                                                storeCategory.url(),
                                                {
                                                    onSuccess: () =>
                                                        categoryForm.reset(),
                                                },
                                            );
                                        }}
                                        className="flex flex-col gap-3 sm:flex-row"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <label
                                                htmlFor="category-name"
                                                className="sr-only"
                                            >
                                                Nama kategori
                                            </label>
                                            <input
                                                id="category-name"
                                                value={categoryForm.data.name}
                                                onChange={(event) =>
                                                    categoryForm.setData(
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Dasar jaringan"
                                                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                required
                                            />
                                            <ErrorMessage
                                                message={
                                                    categoryForm.errors.name
                                                }
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={categoryForm.processing}
                                            className="h-11 shrink-0 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            Tambah kategori
                                        </button>
                                    </form>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {categories.map((category) => (
                                            <span
                                                key={category.id}
                                                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                                            >
                                                {category.name}
                                                <span className="text-xs text-slate-400">
                                                    {category.questions_count}
                                                </span>
                                            </span>
                                        ))}
                                        {categories.length === 0 && (
                                            <p className="text-sm text-slate-500">
                                                Belum ada kategori.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {examDialogOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                                <section
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="exam-dialog-title"
                                    className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
                                >
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div>
                                            <h2
                                                id="exam-dialog-title"
                                                className="text-xl font-semibold text-slate-900"
                                            >
                                                {editingExam
                                                    ? 'Edit ujian'
                                                    : 'Buat ujian'}
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Pilih soal dari bank soal untuk
                                                menyusun ujian.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={closeExamDialog}
                                            aria-label="Tutup formulir ujian"
                                            className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={submitExam}
                                        className="space-y-5"
                                    >
                                        <div>
                                            <FormLabel htmlFor="exam-title">
                                                Nama ujian
                                            </FormLabel>
                                            <input
                                                id="exam-title"
                                                value={examForm.data.title}
                                                onChange={(event) =>
                                                    examForm.setData(
                                                        'title',
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                required
                                            />
                                            <ErrorMessage
                                                message={examForm.errors.title}
                                            />
                                        </div>

                                        <div>
                                            <FormLabel htmlFor="exam-description">
                                                Deskripsi (opsional)
                                            </FormLabel>
                                            <textarea
                                                id="exam-description"
                                                rows={2}
                                                value={
                                                    examForm.data.description
                                                }
                                                onChange={(event) =>
                                                    examForm.setData(
                                                        'description',
                                                        event.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                            <ErrorMessage
                                                message={
                                                    examForm.errors.description
                                                }
                                            />
                                        </div>

                                        <fieldset>
                                            <legend className="mb-2 text-sm font-medium text-slate-700">
                                                Pilih soal
                                            </legend>
                                            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                                                {questions.map((question) => (
                                                    <label
                                                        key={question.id}
                                                        className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-slate-50"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={examForm.data.question_ids.includes(
                                                                question.id,
                                                            )}
                                                            onChange={(
                                                                event,
                                                            ) => {
                                                                const selected =
                                                                    examForm
                                                                        .data
                                                                        .question_ids;

                                                                examForm.setData(
                                                                    'question_ids',
                                                                    event.target
                                                                        .checked
                                                                        ? [
                                                                            ...selected,
                                                                            question.id,
                                                                        ]
                                                                        : selected.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                question.id,
                                                                        ),
                                                                );
                                                            }}
                                                            className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="min-w-0">
                                                            <span className="block text-sm font-medium text-slate-800">
                                                                {
                                                                    question.question_text
                                                                }
                                                            </span>
                                                            <span className="mt-0.5 block text-xs text-slate-500">
                                                                {
                                                                    question.category_name
                                                                }
                                                            </span>
                                                        </span>
                                                    </label>
                                                ))}
                                                {questions.length === 0 && (
                                                    <p className="py-6 text-center text-sm text-slate-500">
                                                        Tambahkan soal sebelum
                                                        membuat ujian.
                                                    </p>
                                                )}
                                            </div>
                                            <ErrorMessage
                                                message={
                                                    examForm.errors.question_ids
                                                }
                                            />
                                        </fieldset>

                                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                                            <button
                                                type="button"
                                                onClick={closeExamDialog}
                                                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={
                                                    examForm.processing ||
                                                    questions.length === 0
                                                }
                                                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {examForm.processing
                                                    ? 'Menyimpan...'
                                                    : 'Simpan ujian'}
                                            </button>
                                        </div>
                                    </form>
                                </section>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
