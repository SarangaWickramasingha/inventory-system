<?php

namespace App\Core;

use Exception;

/**
 * Class Validator
 * 
 * Reusable server-side validation engine supporting standard rules:
 * required, numeric, integer, string, min, max, nullable, unique.
 */
class Validator
{
    protected array $data = [];
    protected array $rules = [];
    protected array $customMessages = [];
    protected array $errors = [];
    protected ?\PDO $db = null;

    public function __construct(array $data, array $rules, array $customMessages = [], ?\PDO $db = null)
    {
        $this->data = $data;
        $this->rules = $rules;
        $this->customMessages = $customMessages;
        $this->db = $db;
    }

    /**
     * Factory instantiation method.
     */
    public static function make(array $data, array $rules, array $customMessages = [], ?\PDO $db = null): self
    {
        $validator = new self($data, $rules, $customMessages, $db);
        $validator->validate();
        return $validator;
    }

    /**
     * Run validation logic against all specified rules.
     */
    public function validate(): array
    {
        $this->errors = [];

        foreach ($this->rules as $field => $ruleString) {
            $value = $this->data[$field] ?? null;
            $rulesArray = is_array($ruleString) ? $ruleString : explode('|', $ruleString);

            // Handle nullable rule first
            $isNullable = in_array('nullable', $rulesArray, true);
            if ($isNullable && ($value === null || $value === '')) {
                continue;
            }

            foreach ($rulesArray as $rule) {
                if ($rule === 'nullable') {
                    continue;
                }

                $this->applyRule($field, $value, $rule);
            }
        }

        if ($this->fails()) {
            throw new ValidationException($this->errors);
        }

        return $this->validatedData();
    }

    /**
     * Apply individual rule check.
     */
    protected function applyRule(string $field, mixed $value, string $rule): void
    {
        $params = [];
        if (str_contains($rule, ':')) {
            [$ruleName, $paramString] = explode(':', $rule, 2);
            $params = explode(',', $paramString);
        } else {
            $ruleName = $rule;
        }

        switch ($ruleName) {
            case 'required':
                if ($value === null || (is_string($value) && trim($value) === '') || (is_array($value) && empty($value))) {
                    $this->addError($field, 'required', "The {$this->formatFieldName($field)} field is required.");
                }
                break;

            case 'numeric':
                if ($value !== null && $value !== '' && !is_numeric($value)) {
                    $this->addError($field, 'numeric', "The {$this->formatFieldName($field)} must be a valid number.");
                }
                break;

            case 'integer':
                if ($value !== null && $value !== '' && filter_var($value, FILTER_VALIDATE_INT) === false) {
                    $this->addError($field, 'integer', "The {$this->formatFieldName($field)} must be an integer.");
                }
                break;

            case 'string':
                if ($value !== null && !is_string($value)) {
                    $this->addError($field, 'string', "The {$this->formatFieldName($field)} must be text.");
                }
                break;

            case 'min':
                $min = (float) ($params[0] ?? 0);
                if (is_numeric($value) && (float)$value < $min) {
                    $this->addError($field, 'min', "The {$this->formatFieldName($field)} must be at least {$min}.");
                } elseif (is_string($value) && mb_strlen($value) < $min) {
                    $this->addError($field, 'min', "The {$this->formatFieldName($field)} must be at least {$min} characters.");
                }
                break;

            case 'max':
                $max = (float) ($params[0] ?? 0);
                if (is_numeric($value) && (float)$value > $max) {
                    $this->addError($field, 'max', "The {$this->formatFieldName($field)} may not be greater than {$max}.");
                } elseif (is_string($value) && mb_strlen($value) > $max) {
                    $this->addError($field, 'max', "The {$this->formatFieldName($field)} may not be greater than {$max} characters.");
                }
                break;

            case 'unique':
                $table = $params[0] ?? 'products';
                $column = $params[1] ?? $field;
                $exceptId = $params[2] ?? null;
                $idColumn = $params[3] ?? 'id';

                if ($value !== null && $value !== '' && $this->db) {
                    $sql = "SELECT COUNT(*) FROM {$table} WHERE {$column} = :val AND deleted_at IS NULL";
                    $bindings = [':val' => $value];

                    if ($exceptId !== null && $exceptId !== '') {
                        $sql .= " AND {$idColumn} != :except_id";
                        $bindings[':except_id'] = $exceptId;
                    }

                    $stmt = $this->db->prepare($sql);
                    $stmt->execute($bindings);
                    if ((int)$stmt->fetchColumn() > 0) {
                        $this->addError($field, 'unique', "SKU '{$value}' already exists in the system.");
                    }
                }
                break;
        }
    }

    /**
     * Format field label for human readable error messages.
     */
    protected function formatFieldName(string $field): string
    {
        return str_replace('_', ' ', $field);
    }

    /**
     * Add error message with custom message support.
     */
    protected function addError(string $field, string $rule, string $defaultMessage): void
    {
        $customKey = "{$field}.{$rule}";
        $message = $this->customMessages[$customKey] 
            ?? $this->customMessages[$field] 
            ?? $defaultMessage;

        if (!isset($this->errors[$field])) {
            $this->errors[$field] = [];
        }
        $this->errors[$field][] = $message;
    }

    public function fails(): bool
    {
        return !empty($this->errors);
    }

    public function passes(): bool
    {
        return empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function validatedData(): array
    {
        return array_intersect_key($this->data, $this->rules);
    }
}

/**
 * Custom Validation Exception carrying structured field error messages.
 */
class ValidationException extends Exception
{
    protected array $errors;

    public function __construct(array $errors, string $message = "The given data failed validation.")
    {
        parent::__construct($message, 422);
        $this->errors = $errors;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
