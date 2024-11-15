<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateFollowUpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;  // Set to true to allow the request to proceed.
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'lead_id' => 'required|exists:leads,id', // Ensure the lead exists
            'scheduled_at' => 'required|date|after:now|unique:follow_ups,scheduled_at,NULL,id,lead_id,' . $this->lead_id, // Ensure follow-up is scheduled for the future, and the lead doesn't have a follow-up at the same time
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Custom validation error messages.
     */
    public function messages()
    {
        return [
            'lead_id.required' => 'Lead ID is required.',
            'lead_id.exists' => 'The selected lead does not exist.',
            'scheduled_at.required' => 'The scheduled date for the follow-up is required.',
            'scheduled_at.date' => 'The scheduled date must be a valid datetime (e.g., 2024-11-14 15:00:00).',
            'scheduled_at.after' => 'The follow-up must be scheduled for a future date and time.',
            'scheduled_at.unique' => 'This lead already has a follow-up scheduled for the selected date and time.',
            'notes.string' => 'Notes must be a string.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     * 
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
