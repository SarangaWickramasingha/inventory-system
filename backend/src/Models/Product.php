<?php

namespace StockFlow\Backend\Models;

use JsonSerializable;

/**
 * Product Domain Entity
 * Owner: Ashan (Product Core & Information Display)
 */
class Product implements JsonSerializable
{
    private ?int $id;
    private string $sku;
    private string $name;
    private ?int $categoryId;
    private ?string $categoryName;
    private float $price;
    private float $costPrice;
    private int $quantity;
    private int $minStockAlert;
    private string $unit;
    private ?string $description;
    private ?string $imageUrl;
    private string $status;
    private ?string $deletedAt;
    private ?string $createdAt;
    private ?string $updatedAt;

    public function __construct(
        ?int $id = null,
        string $sku = '',
        string $name = '',
        ?int $categoryId = null,
        ?string $categoryName = null,
        float $price = 0.00,
        float $costPrice = 0.00,
        int $quantity = 0,
        int $minStockAlert = 5,
        string $unit = 'pcs',
        ?string $description = null,
        ?string $imageUrl = null,
        string $status = 'in_stock',
        ?string $deletedAt = null,
        ?string $createdAt = null,
        ?string $updatedAt = null
    ) {
        $this->id = $id;
        $this->sku = $sku;
        $this->name = $name;
        $this->categoryId = $categoryId;
        $this->categoryName = $categoryName;
        $this->price = $price;
        $this->costPrice = $costPrice;
        $this->quantity = max(0, $quantity);
        $this->minStockAlert = $minStockAlert;
        $this->unit = $unit;
        $this->description = $description;
        $this->imageUrl = $imageUrl;
        $this->status = $status;
        $this->deletedAt = $deletedAt;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            isset($data['id']) ? (int)$data['id'] : null,
            $data['sku'] ?? '',
            $data['name'] ?? '',
            isset($data['category_id']) ? (int)$data['category_id'] : (isset($data['categoryId']) ? (int)$data['categoryId'] : null),
            $data['category_name'] ?? $data['categoryName'] ?? null,
            isset($data['price']) ? (float)$data['price'] : 0.00,
            isset($data['cost_price']) ? (float)$data['cost_price'] : (isset($data['costPrice']) ? (float)$data['costPrice'] : 0.00),
            isset($data['quantity']) ? max(0, (int)$data['quantity']) : 0,
            isset($data['min_stock_alert']) ? (int)$data['min_stock_alert'] : (isset($data['minStockAlert']) ? (int)$data['minStockAlert'] : 5),
            $data['unit'] ?? 'pcs',
            $data['description'] ?? null,
            $data['image_url'] ?? $data['imageUrl'] ?? null,
            $data['status'] ?? 'in_stock',
            $data['deleted_at'] ?? $data['deletedAt'] ?? null,
            $data['created_at'] ?? $data['createdAt'] ?? null,
            $data['updated_at'] ?? $data['updatedAt'] ?? null
        );
    }

    // Getters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSku(): string
    {
        return $this->sku;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getCategoryId(): ?int
    {
        return $this->categoryId;
    }

    public function getCategoryName(): ?string
    {
        return $this->categoryName;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getCostPrice(): float
    {
        return $this->costPrice;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function getMinStockAlert(): int
    {
        return $this->minStockAlert;
    }

    public function getUnit(): string
    {
        return $this->unit;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getDeletedAt(): ?string
    {
        return $this->deletedAt;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?string
    {
        return $this->updatedAt;
    }

    // Setters & Mutators
    public function setSku(string $sku): void
    {
        $this->sku = $sku;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setCategoryId(?int $categoryId): void
    {
        $this->categoryId = $categoryId;
    }

    public function setCategoryName(?string $categoryName): void
    {
        $this->categoryName = $categoryName;
    }

    public function setPrice(float $price): void
    {
        $this->price = $price;
    }

    public function setCostPrice(float $costPrice): void
    {
        $this->costPrice = $costPrice;
    }

    public function setQuantity(int $quantity): void
    {
        $this->quantity = max(0, $quantity);
        $this->updateStatusBasedOnQuantity();
    }

    public function setMinStockAlert(int $minStockAlert): void
    {
        $this->minStockAlert = $minStockAlert;
        $this->updateStatusBasedOnQuantity();
    }

    public function setUnit(string $unit): void
    {
        $this->unit = $unit;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function setImageUrl(?string $imageUrl): void
    {
        $this->imageUrl = $imageUrl;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function setDeletedAt(?string $deletedAt): void
    {
        $this->deletedAt = $deletedAt;
    }

    // Domain Helpers
    public function updateStatusBasedOnQuantity(): void
    {
        if ($this->quantity <= 0) {
            $this->status = 'out_of_stock';
        } elseif ($this->quantity <= $this->minStockAlert) {
            $this->status = 'low_stock';
        } else {
            $this->status = 'in_stock';
        }
    }

    public function isLowStock(): bool
    {
        return $this->quantity <= $this->minStockAlert && $this->quantity > 0;
    }

    public function isOutOfStock(): bool
    {
        return $this->quantity <= 0;
    }

    public function isInStock(): bool
    {
        return $this->quantity > $this->minStockAlert;
    }

    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }

    public function calculateProfitMargin(): float
    {
        return $this->price - $this->costPrice;
    }

    public function calculateTotalStockValue(): float
    {
        return $this->price * $this->quantity;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'category_id' => $this->categoryId,
            'category_name' => $this->categoryName,
            'price' => $this->price,
            'cost_price' => $this->costPrice,
            'quantity' => $this->quantity,
            'min_stock_alert' => $this->minStockAlert,
            'unit' => $this->unit,
            'description' => $this->description,
            'image_url' => $this->imageUrl,
            'status' => $this->status,
            'deleted_at' => $this->deletedAt,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
