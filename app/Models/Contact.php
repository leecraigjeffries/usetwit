<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Contact extends Model
{
    protected $guarded = [];

    protected array $validContactables = [
        Customer::class,
    ];

    use HasFactory;

    public function contactable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getValidContactables(): array
    {
        return $this->validContactables;
    }
}
