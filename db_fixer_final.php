<?php
$dbNames = ['skg', 'skgfinal', 'skg_final', 'u731011375_skgfinal', 'laravel'];
$found = false;

foreach ($dbNames as $db) {
    try {
        $pdo = new PDO("mysql:host=127.0.0.1;dbname=$db", "root", "");
        echo "Found database: $db\n";
        $found = $db;
        break;
    } catch (PDOException $e) {
        // continue
    }
}

if (!$found) {
    echo "Could not find database automatically.\n";
    exit(1);
}

$tables = [
    'categories' => ['image'],
    'products' => ['images'],
    'banners' => ['image', 'mobile_image'],
    'blogs' => ['image'],
    'gallery' => ['image'],
    'testimonials' => ['avatar'],
    'product_images' => ['image']
];

foreach ($tables as $table => $columns) {
    foreach ($columns as $column) {
        // First, let's see what we have
        $stmt = $pdo->query("SELECT id, $column FROM $table WHERE $column LIKE '%storage%'");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($results as $row) {
            $oldValue = $row[$column];
            // Remove /storage/ and make sure it starts with /uploads/
            // If it's /storage/uploads/ -> /uploads/
            // If it's /storage/something -> /uploads/something
            $newValue = str_replace('/storage/uploads/', '/uploads/', $oldValue);
            $newValue = str_replace('/storage/', '/uploads/', $newValue);
            
            if ($oldValue !== $newValue) {
                $update = $pdo->prepare("UPDATE $table SET $column = ? WHERE id = ?");
                $update->execute([$newValue, $row['id']]);
                echo "Updated $table.$column ID {$row['id']}: $oldValue -> $newValue\n";
            }
        }
    }
}

echo "Done.\n";
