<?php

namespace StockFlow\Backend\Core;

use PDO;
use PDOException;

/**
 * Server-Side Validation Engine
 * Owner: Tharindu (Product Create/Edit & Validation Engine)
 */
class Validator
{
    private ?PDO $db;
    private array $errors = [];

    public function __construct(?PDO $db = null)
    {
        $this->db = $db;
    }

    /**
     * Validate input dataset against a set of field rule strings.
     *
     * Example:
     * $validator->validate($_POST, [
     *     'sku' => 'required|min:3|max:30|unique:products,sku',
     *     'name' => 'required|min:2|max:100',
     *     'price' => 'required|numeric|min:0.01',
     *     'status' => 'required|in:in_stock,low_stock,out_of_stock'
     * ], $exceptId);
     *
     * @param array $data Input key-value data
     * @param array $rules Key-value rules mapping
     * @param int|null $exceptId Optional ID to exclude for unique checks (useful for updates)
     * @return bool True if validation passes, false otherwise
     */
    public function validate(array $data, array $rules, ?int $exceptId = null): bool
    {
        $this->errors = [];

        foreach ($rules as $field => $ruleString) {
            $value = $data[$field] ?? null;
            $fieldTitle = ucfirst(str_replace('_', ' ', $field));
            $ruleList = is_array($ruleString) ? $ruleString : explode('|', $ruleString);

            foreach ($ruleList as $rule) {
                $ruleName = $rule;
                $ruleParam = null;

                if (str_contains($rule, ':')) {
                    [$ruleName, $ruleParam] = explode(':', $rule, 2);
                }

                switch ($ruleName) {
                    case 'required':
                        if ($value === null || (is_string($value) && trim($value) === '') || (is_array($value) && empty($value))) {
                            $this->addError($field, "{$fieldTitle} is required.");
                            break 2; // Skip further checks for this field if missing
                        }
                        break;

                    case 'numeric':
                        if ($value !== null && $value !== '' && !is_numeric($value)) {
                            $this->addError($field, "{$fieldTitle} must be a valid number.");
                        }
                        break;

                    case 'integer':
                        if ($value !== null && $value !== '' && filter_var($value, FILTER_VALIDATE_INT) === false) {
                            $this->addError($field, "{$fieldTitle} must be an integer.");
                        }
                        break;

                    case 'email':
                        if ($value !== null && $value !== '' && filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
                            $this->addError($field, "{$fieldTitle} must be a valid email address.");
                        }
                        break;

                    case 'min':
                        if ($value !== null && $value !== '') {
                            $min = (float)$ruleParam;
                            if (is_numeric($value)) {
                                if ((float)$value < $min) {
                                    $this->addError($field, "{$fieldTitle} must be at least {$min}.");
                                }
                            } else {
                                if (strlen((string)$value) < (int)$min) {
                                    $this->addError($field, "{$fieldTitle} must be at least {$min} characters.");
                                }
                            }
                        }
                        break;

                    case 'max':
                        if ($value !== null && $value !== '') {
                            $max = (float)$ruleParam;
                            if (is_numeric($value)) {
                                if ((float)$value > $max) {
                                    $this->addError($field, "{$fieldTitle} cannot exceed {$max}.");
                                }
                            } else {
                                if (strlen((string)$value) > (int)$max) {
                                    $this->addError($field, "{$fieldTitle} cannot exceed {$max} characters.");
                                }
                            }
                        }
                        break;

                    case 'sku':
                        if ($value !== null && $value !== '') {
                            if (!preg_match('/^[A-Za-z0-9_\-]+$/', (string)$value)) {
                                $this->addError($field, "{$fieldTitle} can only contain letters, numbers, hyphens, and underscores.");
                            }
                        }
                        break;

                    case 'in':
                        if ($value !== null && $value !== '') {
                            $allowed = explode(',', $ruleParam ?? '');
                            if (!in_array((string)$value, $allowed, true)) {
                                $this->addError($field, "{$fieldTitle} must be one of: " . implode(', ', $allowed) . '.');
                            }
                        }
                        break;

                    case 'unique':
                        if ($value !== null && $value !== '' && $this->db !== null) {
                            [$table, $column] = explode(',', $ruleParam);
                            $column = trim($column);
                            $table = trim($table);

                            try {
                                $sql = "SELECT COUNT(*) FROM {$table} WHERE {$column} = :val";
                                $params = ['val' => $value];

                                // Exclude soft-deleted rows if deleted_at column exists
                                $sql .= " AND (deleted_at IS NULL)";

                                if ($exceptId !== null) {
                                    $sql .= " AND id != :except_id";
                                    $params['except_id'] = $exceptId;
                                }

                                $stmt = $this->db->prepare($sql);
                                $stmt->execute($params);

                                if ((int)$stmt->fetchColumn() > 0) {
                                    $this->addError($field, "The specified {$fieldTitle} is already in use.");
                                }
                            } catch (PDOException $e) {
                                // If database query fails, log error and flag validation
                                $this->addError($field, "Failed to verify uniqueness for {$fieldTitle}.");
                            }
                        }
                        break;
                }
            }
        }

        return empty($this->errors);
    }

    /**
     * Check if validation passed.
     */
    public function passes(): bool
    {
        return empty($this->errors);
    }

    /**
     * Check if validation failed.
     */
    public function fails(): bool
    {
        return !empty($this->errors);
    }

    /**
     * Get all validation errors organized by field.
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Get the first validation error message string.
     */
    public function getFirstError(): ?string
    {
        foreach ($this->errors as $fieldErrors) {
            if (!empty($fieldErrors)) {
                return $fieldErrors[0];
            }
        }
        return null;
    }

    /**
     * Add an error message for a specific field.
     */
    private function addError(string $field, string $message): void
    {
        $this->errors[$field][] = $message;
    }
}
