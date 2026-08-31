<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/InMemoryFoyerGateway.php';

use App\InMemoryFoyerGateway;

const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: ' . ALLOWED_METHODS);
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_start();

if (!isset($_SESSION['foyers'])) {
    $_SESSION['foyers'] = [];
    $_SESSION['nextFoyerId'] = 1;
}

$gateway = new InMemoryFoyerGateway($_SESSION['foyers'], $_SESSION['nextFoyerId']);
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';

try {
    if ($path === '/api/foyers' && $method === 'GET') {
        respond(200, ['data' => $gateway->findAll()]);
    }

    if ($path === '/api/foyers' && $method === 'POST') {
        $payload = readJsonBody();
        $errors = validateFoyer($payload);

        if ($errors !== []) {
            respond(422, ['error' => 'Données invalides.', 'details' => $errors]);
        }

        respond(201, ['data' => $gateway->create($payload)]);
    }

    if (preg_match('#^/api/foyers/(\d+)$#', $path, $matches) === 1) {
        $id = (int) $matches[1];

        if ($method === 'GET') {
            $foyer = $gateway->find($id);
            $foyer === null
                ? respond(404, ['error' => 'Foyer introuvable.'])
                : respond(200, ['data' => $foyer]);
        }

        if ($method === 'PUT' || $method === 'PATCH') {
            $current = $gateway->find($id);
            if ($current === null) {
                respond(404, ['error' => 'Foyer introuvable.']);
            }

            $payload = readJsonBody();
            $candidate = $method === 'PATCH'
                ? array_merge($current, $payload)
                : $payload;
            $errors = validateFoyer($candidate);

            if ($errors !== []) {
                respond(422, ['error' => 'Données invalides.', 'details' => $errors]);
            }

            respond(200, ['data' => $gateway->update($id, $payload, $method === 'PATCH')]);
        }

        if ($method === 'DELETE') {
            if (!$gateway->delete($id)) {
                respond(404, ['error' => 'Foyer introuvable.']);
            }

            http_response_code(204);
            exit;
        }
    }

    respond(404, ['error' => 'Route introuvable.']);
} catch (JsonException) {
    respond(400, ['error' => 'Le corps de la requête doit contenir un JSON valide.']);
} catch (Throwable $exception) {
    error_log($exception->__toString());
    respond(500, ['error' => 'Une erreur interne est survenue.']);
}

/** @return array<string, mixed> */
function readJsonBody(): array
{
    $body = file_get_contents('php://input');
    $decoded = json_decode($body ?: '', true, 512, JSON_THROW_ON_ERROR);

    if (!is_array($decoded)) {
        throw new JsonException('Un objet JSON est attendu.');
    }

    return $decoded;
}

/** @param array<string, mixed> $payload
 *  @return array<string, string>
 */
function validateFoyer(array $payload): array
{
    $errors = [];
    $requiredStrings = ['nomResponsable', 'adresse', 'commune'];

    foreach ($requiredStrings as $field) {
        if (!isset($payload[$field]) || !is_string($payload[$field]) || trim($payload[$field]) === '') {
            $errors[$field] = 'Ce champ est obligatoire et doit être une chaîne non vide.';
        }
    }

    if (!isset($payload['nombrePersonnes']) || !is_int($payload['nombrePersonnes']) || $payload['nombrePersonnes'] < 1) {
        $errors['nombrePersonnes'] = 'Ce champ doit être un nombre entier supérieur ou égal à 1.';
    }

    if (array_key_exists('telephone', $payload) && $payload['telephone'] !== null && !is_string($payload['telephone'])) {
        $errors['telephone'] = 'Ce champ doit être une chaîne ou null.';
    }

    return $errors;
}

/** @param array<string, mixed> $body */
function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
