<?php

declare(strict_types=1);

namespace App;

final class InMemoryFoyerGateway
{
    /** @param array<int, array<string, mixed>> $foyers */
    public function __construct(
        private array &$foyers,
        private int &$nextId,
    ) {
    }

    /** @return list<array<string, mixed>> */
    public function findAll(): array
    {
        return array_values($this->foyers);
    }

    /** @return array<string, mixed>|null */
    public function find(int $id): ?array
    {
        return $this->foyers[$id] ?? null;
    }

    /** @param array<string, mixed> $data
     *  @return array<string, mixed>
     */
    public function create(array $data): array
    {
        $now = gmdate(DATE_ATOM);
        $foyer = $this->sanitize($data);
        $foyer['id'] = $this->nextId++;
        $foyer['createdAt'] = $now;
        $foyer['updatedAt'] = $now;
        $this->foyers[$foyer['id']] = $foyer;

        return $foyer;
    }

    /** @param array<string, mixed> $data
     *  @return array<string, mixed>
     */
    public function update(int $id, array $data, bool $partial = false): array
    {
        $current = $this->foyers[$id];
        $values = $partial ? array_merge($current, $data) : $data;
        $updated = $this->sanitize($values);
        $updated['id'] = $id;
        $updated['createdAt'] = $current['createdAt'];
        $updated['updatedAt'] = gmdate(DATE_ATOM);
        $this->foyers[$id] = $updated;

        return $updated;
    }

    public function delete(int $id): bool
    {
        if (!isset($this->foyers[$id])) {
            return false;
        }

        unset($this->foyers[$id]);
        return true;
    }

    /** @param array<string, mixed> $data
     *  @return array<string, mixed>
     */
    private function sanitize(array $data): array
    {
        return [
            'nomResponsable' => trim((string) $data['nomResponsable']),
            'adresse' => trim((string) $data['adresse']),
            'commune' => trim((string) $data['commune']),
            'nombrePersonnes' => (int) $data['nombrePersonnes'],
            'telephone' => isset($data['telephone']) ? trim((string) $data['telephone']) : null,
        ];
    }
}
