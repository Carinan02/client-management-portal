<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Import extends Model
{
    protected $fillable = [
        'started_by',
        'filename',
        'stored_path', 
        'status',            // Queued | Processing | Completed | Failed
        'imported_count',
        'skipped_count',
       
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
