# Login first
$loginBody = '{"email":"test@example.com","password":"password123"}'
$login = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/auth/login" -Body $loginBody -ContentType "application/json"
$token = $login.token
Write-Host "Logged in. Token received."

# Try creating a task and capture full error
$taskBody = '{"title":"Study Chapter 1","description":"Review algebra basics","priority":"HIGH","status":"PENDING"}'
$headers = @{ "Authorization" = "Bearer $token" }

try {
    $created = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/tasks" -Body $taskBody -ContentType "application/json" -Headers $headers
    Write-Host "Task created:"
    $created | ConvertTo-Json -Depth 5
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.ErrorDetails.Message
    Write-Host "Task creation FAILED. Status: $statusCode"
    Write-Host "Error body: $errorBody"
    Write-Host "Exception: $($_.Exception.Message)"
}

# GET all tasks regardless
Write-Host ""
Write-Host "--- GET /api/tasks ---"
try {
    $tasks = Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/tasks" -Headers $headers
    $tasks | ConvertTo-Json -Depth 5
} catch {
    Write-Host "GET tasks FAILED: $($_.ErrorDetails.Message)"
}
