<?php

namespace App\Imports;

use App\Models\Client;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Validators\Failure;
use Throwable;

class ClientsImport implements
    ToModel,
    WithHeadingRow,
    WithValidation,
    SkipsOnFailure,
    SkipsOnError
{
    // Provides the $failures and $errors collections used by SkipsOnFailure/SkipsOnError
    use SkipsFailures, SkipsErrors;

    private int $importedCount = 0;
    private int $skippedCount  = 0;

    public function model(array $row): ?Client
    {
        $email = strtolower(trim($row['email'] ?? ''));

        // Skip rows whose email already exists — do not overwrite
        if (Client::whereRaw('LOWER(email) = ?', [$email])->exists()) {
            $this->skippedCount++;
            return null;
        }

        $this->importedCount++;

        return new Client([
            'full_name'    => trim($row['full_name']),
            'email'        => $email,
            'phone'        => $this->nullableStr($row['phone'] ?? null),
            'company_name' => $this->nullableStr($row['company_name'] ?? null),
            'status'       => $this->resolveStatus($row['status'] ?? ''),
        ]);
    }

    // ── Validation rules ──────────────────────────────────────────────────────

    /**
     * Server-side validation applied before model() is called.
     * Rows failing these rules are passed to onFailure() and skipped.
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255'],
        ];
    }

    /**
     * Human-readable attribute names shown in validation messages.
     */
    public function customValidationAttributes(): array
    {
        return [
            'full_name' => 'full name',
            'email'     => 'email address',
        ];
    }


    public function onFailure(Failure ...$failures): void
    {
        $uniqueRows = collect($failures)
            ->map(fn (Failure $f) => $f->row())
            ->unique()
            ->count();

        $this->skippedCount += $uniqueRows;
    }


    public function onError(Throwable $e): void
    {
        $this->skippedCount++;
    }


    public function importedCount(): int
    {
        return $this->importedCount;
    }

    public function skippedCount(): int
    {
        return $this->skippedCount;
    }


    private function nullableStr(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        $trimmed = trim((string) $value);
        return $trimmed === '' ? null : $trimmed;
    }


    private function resolveStatus(string $raw): string
    {
        return match (strtolower(trim($raw))) {
            'active'   => 'Active',
            'inactive' => 'Inactive',
            default    => 'Lead',
        };
    }
}
