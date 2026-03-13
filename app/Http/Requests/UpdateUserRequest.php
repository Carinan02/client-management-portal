<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'string', 'email', 'max:255', "unique:users,email,{$userId}"],
            'password'  => ['nullable', Password::defaults()],
            'role'      => ['required', 'in:admin,manager,staff'],
            'is_active' => ['boolean'],
        ];
    }
}