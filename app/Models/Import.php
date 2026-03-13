<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Import extends Model
{
    protected $fillable = [
    'started_by',
    'filename',
    'file_name',        // ← add
    'file_contents',
    'stored_path',
    'status',
    'imported_count',
    'skipped_count',
    'error_message',    // ← add
];

    protected $casts = [
        'imported_count' => 'integer',
        'skipped_count'  => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /** True once the import has reached a terminal state. */
    public function isFinished(): bool
    {
        return in_array($this->status, ['Completed', 'Failed']);
    }
}
