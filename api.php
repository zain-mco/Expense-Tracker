<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_file = __DIR__ . '/database.sqlite';
$pdo = new PDO('sqlite:' . $db_file);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Initialize table if not exists
$pdo->exec("CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    title TEXT,
    amount REAL,
    category TEXT,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM expenses ORDER BY date DESC, created_at DESC");
    $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($expenses);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($input['id'])) {
        $stmt = $pdo->prepare("INSERT INTO expenses (id, title, amount, category, date) VALUES (:id, :title, :amount, :category, :date)");
        $stmt->execute([
            ':id' => $input['id'],
            ':title' => $input['title'] ?? '',
            ':amount' => $input['amount'] ?? 0,
            ':category' => $input['category'] ?? '',
            ':date' => $input['date'] ?? ''
        ]);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM expenses WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing id']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>
