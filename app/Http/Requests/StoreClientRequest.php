<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
         return $this->user()->isAdminOrManager(); // Admin or manager only
    }

    public function rules(): array
    {
        return [
            'full_name'        => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255', 'unique:clients'],
            'phone'            => ['nullable', 'string', 'max:50'],
            'company_name'     => ['nullable', 'string', 'max:255'],
            'status'           => ['required', 'in:lead,active,inactive'],
            'staff_id'         => ['nullable', 'exists:users,id'],
            'services'         => ['nullable', 'array'],
            'services.*.id'    => ['required', 'exists:services,id'],
            'services.*.status'=> ['required', 'in:Pending,In Progress,Completed'],
        ];
    }
}