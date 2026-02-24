<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=u731011375_skgfinal", "root", "");
    $stmt = $pdo->query("SELECT id, name, image FROM categories LIMIT 10");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: {$row['id']}, Name: {$row['name']}, Image: {$row['image']}\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
