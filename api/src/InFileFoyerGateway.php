<?php

declare(strict_types=1);

namespace App;

use RuntimeException;

final class InFileFoyerGateway
{
    public function __construct(
        private string $filePath,
    ) {
        $directory = dirname($this->filePath);

        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException("Impossible de créer le dossier {$directory}.");
        }
    }

    /** @return list<array<string, mixed>> */
    public function findAll(): array
    {
        return array_values($this->read()['foyers']);
    }

    /** @return array<string, mixed>|null */
    public function find(int $id): ?array
    {
        return $this->read()['foyers'][$id] ?? null;
    }

    /** @param array<string, mixed> $data
     *  @return array<string, mixed>
     */
    public function create(array $data): array
    {
        return $this->write(function (array &$store) use ($data): array {
            $now = gmdate(DATE_ATOM);
            $foyer = $this->sanitize($data);
            $foyer['id'] = $store['nextId']++;
            $foyer['createdAt'] = $now;
            $foyer['updatedAt'] = $now;
            $store['foyers'][$foyer['id']] = $foyer;

            return $foyer;
        });
    }

    /** @param array<string, mixed> $data
     *  @return array<string, mixed>
     */
    public function update(int $id, array $data, bool $partial = false): array
    {
        return $this->write(function (array &$store) use ($id, $data, $partial): array {
            $current = $store['foyers'][$id];
            $values = $partial ? array_merge($current, $data) : $data;
            $updated = $this->sanitize($values);
            $updated['id'] = $id;
            $updated['createdAt'] = $current['createdAt'];
            $updated['updatedAt'] = gmdate(DATE_ATOM);
            $store['foyers'][$id] = $updated;

            return $updated;
        });
    }

    public function delete(int $id): bool
    {
        return $this->write(function (array &$store) use ($id): bool {
            if (!isset($store['foyers'][$id])) {
                return false;
            }

            unset($store['foyers'][$id]);
            return true;
        });
    }

    /** @return array{nextId: int, foyers: array<int, array<string, mixed>>} */
    private function read(): array
    {
        $handle = $this->open();

        try {
            flock($handle, LOCK_SH);
            return $this->decode(stream_get_contents($handle) ?: '');
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    /**
     * Lit, modifie puis réécrit le fichier sous verrou exclusif.
     *
     * @template T
     * @param callable(array{nextId: int, foyers: array<int, array<string, mixed>>}&): T $mutation
     * @return T
     */
    private function write(callable $mutation): mixed
    {
        $handle = $this->open();

        try {
            flock($handle, LOCK_EX);
            $store = $this->decode(stream_get_contents($handle) ?: '');
            $result = $mutation($store);

            ftruncate($handle, 0);
            rewind($handle);
            fwrite($handle, json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
            fflush($handle);

            return $result;
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    /** @return resource */
    private function open()
    {
        $handle = fopen($this->filePath, 'c+');

        if ($handle === false) {
            throw new RuntimeException("Impossible d'ouvrir {$this->filePath}.");
        }

        return $handle;
    }

    /** @return array{nextId: int, foyers: array<int, array<string, mixed>>} */
    private function decode(string $contents): array
    {
        if (trim($contents) === '') {
            return ['nextId' => 1, 'foyers' => []];
        }

        $data = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
        $foyers = [];

        // Les clés JSON sont des chaînes : on réindexe par id entier.
        foreach ($data['foyers'] ?? [] as $foyer) {
            $foyers[(int) $foyer['id']] = $foyer;
        }

        return ['nextId' => (int) ($data['nextId'] ?? 1), 'foyers' => $foyers];
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
