<?php

// Ensure that the content type of the incoming request is JSON
if ($_SERVER['CONTENT_TYPE'] === 'application/json') {

 
    // Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));


    // Attempt to decode the incoming RAW post data from JSON.
    $decodedData = json_decode($content, true);

    // If json_decode failed, the JSON is invalid.
    if (!is_array($decodedData)) {
        echo json_encode(['error' => 'Invalid JSON']);
        exit();
    }

 

    $apiData = [
        'firstname' => $decodedData['firstname'],
        'lastname' => $decodedData['lastname'],
        'institution_name' => $decodedData['institution_name'],
        'email' => $decodedData['email'],
        'specialty' => $decodedData['specialty'],
        'address_country' => $decodedData['address_country'] ?? 'Germany',
        'address_street_line_1' => $decodedData['address_street_line_1'] ?? 'NA',
        'address_zip_postal_code' => $decodedData['address_zip_postal_code'] ?? "00000",
    ];
    



    // Define URLs for development and production
    $developmentUrl = 'https://apigee.novocure-dev.com/veeva/hcp';
    $productionUrl = 'https://apigee-novocure.com/veeva/hcp';

    $devAPIKey = 'SKzXbWkUqaUhhGGVz4r5T3MAaukvG391on6GJDdDZO94EVJb';

    // Choose URL based on the environment
    $environment = 'development'; // or 'production'

    // Select the appropriate URL
    $apiUrl = ($environment === 'development') ? $developmentUrl : $productionUrl;

   

    // Initialize cURL session with the selected URL
    $ch = curl_init($apiUrl);
    // Debug: Output the cURL initialization URL


    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($apiData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: SKzXbWkUqaUhhGGVz4r5T3MAaukvG391on6GJDdDZO94EVJb' 
    ]);

    // Debug: Output before executing cURL

    // Execute cURL session and capture the response
    $response = curl_exec($ch);

    // Check for errors in the cURL request
  // Check for errors in the cURL request
    if (curl_errno($ch)) {
        echo json_encode(['error' => curl_error($ch)]);
    } else {
        echo $response; // Forward the raw response for inspection
    }

    // Close cURL session
    curl_close($ch);

    


} else {
    echo json_encode(['error' => 'Invalid content type']);
}
