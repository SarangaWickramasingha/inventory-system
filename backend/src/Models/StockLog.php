<?php

namespace StockFlow\Backend\Models;

use JsonSerializable;

/**
 * StockLog Domain Entity
 * Owner: Sashika (Staff Activity Portal & Stock Movements)
 */
class StockLog implements JsonSerializable
{
    private ?int $id;
    private int $productId;
    private ?int $userId;
    private string $type; // 'IN', 'OUT', 'ADJUSTMENT'
    private int $quantityChanged;
    private int $previousQuantity;
    private int $newQuantity;
    private ?string $notes;
    private ?string $createdAt;

    // Additional joined metadata for API responses
    private ?string $productName;
    private ?string $sku;
    private ?string $category;
    private ?string $userName;
    private ?string $userRole;

    public function __construct(
        ?int $id = null,
        int $productId = 0,
        ?int $userId = null,
        string $type = 'IN',
        int $quantityChanged = 0,
        int $previousQuantity = 0,
        int $newQuantity = 0,
        ?string $notes = null,
        ?string $createdAt = null,
        ?string $productName = null,
        ?string $sku = null,
        ?string $category = null,
        ?string $userName = null,
        ?string $userRole = null
    ) {
        $this->id = $id;
        $this->productId = $productId;
        $this->userId = $userId;
        $this->type = strtoupper($type);
        $this->quantityChanged = $quantityChanged;
        $this->previousQuantity = $previousQuantity;
        $this->newQuantity = $newQuantity;
        $this->notes = $notes;
        $this->createdAt = $createdAt;
        $this->productName = $productName;
        $this->sku = $sku;
        $this->category = $category;
        $this->userName = $userName;
        $this->userRole = $userRole;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            isset($data['id']) ? (int)$data['id'] : null,
            (int)($data['product_id'] ?? $data['productId'] ?? 0),
            isset($data['user_id']) ? (int)$data['user_id'] : (isset($data['userId']) ? (int)$data['userId'] : null),
            $data['type'] ?? 'IN',
            (int)($data['quantity_changed'] ?? $data['quantityChanged'] ?? 0),
            (int)($data['previous_quantity'] ?? $data['previousQuantity'] ?? 0),
            (int)($data['new_quantity'] ?? $data['newQuantity'] ?? 0),
            $data['notes'] ?? null,
            $data['created_at'] ?? $data['createdAt'] ?? null,
            $data['product_name'] ?? $data['productName'] ?? null,
            $data['sku'] ?? null,
            $data['category'] ?? null,
            $data['user_name'] ?? $data['userName'] ?? $data['full_name'] ?? null,
            $data['user_role'] ?? $data['userRole'] ?? $data['role'] ?? null
        );
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProductId(): int
    {
        return $this->productId;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getQuantityChanged(): int
    {
        return $this->quantityChanged;
    }

    public function getPreviousQuantity(): int
    {
        return $this->previousQuantity;
    }

    public function getNewQuantity(): int
    {
        return $this->newQuantity;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    public function getProductName(): ?string
    {
        return $this->productName;
    }

    public function getSku(): ?string
    {
        return $this->sku;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function getUserName(): ?string
    {
        return $this->userName;
    }

    public function getUserRole(): ?string
    {
        return $this->userRole;
    }

    public function toArray(): array
    {
        $formattedQtyChanged = $this->quantityChanged > 0 && $this->type === 'IN'
            ? "+{$this->quantityChanged}"
            : (string)$this->quantityChanged;

        return [
            'id' => $this->id,
            'productId' => $this->productId,
            'userId' => $this->userId,
            'type' => $this->type,
            'quantityChanged' => $formattedQtyChanged,
            'rawQuantityChanged' => $this->quantityChanged,
            'previousQuantity' => $this->previousQuantity,
            'newQuantity' => $this->newQuantity,
            'notes' => $this->notes,
            'createdAt' => $this->createdAt,
            'timestamp' => $this->createdAt ?? date('c'),
            'productName' => $this->productName ?? 'Stock Item',
            'sku' => $this->sku ?? 'SKU-LOG',
            'category' => $this->category ?? 'General',
            'user' => $this->userName ?? 'System User',
            'userRole' => ucfirst($this->userRole ?? 'staff'),
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
