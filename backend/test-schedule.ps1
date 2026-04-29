# Login first
$loginBody = '{"email":"test@example.com","password":"password123"}'
try {
    $login = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/auth/login" -Body $loginBody -ContentType "application/json"
} catch {
    Write-Host "Login failed. Trying to register..."
    Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/auth/register" -Body $loginBody -ContentType "application/json"
    $login = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/auth/login" -Body $loginBody -ContentType "application/json"
}
$token = $login.token
$headers = @{ "Authorization" = "Bearer $token" }
Write-Host "Logged in."

# 1. Create multiple tasks with estimated hours
Write-Host "Creating test tasks..."
$tasks = @(
    '{"title":"Quantum Physics (6h)","estimatedHours":6,"dueDate":"2026-05-01"}'
    '{"title":"Linear Algebra (2h)","estimatedHours":2,"dueDate":"2026-05-02"}'
    '{"title":"Data Structures (8h)","estimatedHours":8,"dueDate":"2026-05-05"}'
)

foreach ($taskBody in $tasks) {
    Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/tasks" -Body $taskBody -ContentType "application/json" -Headers $headers
}
Write-Host "Tasks created."

# 2. Generate Schedule
Write-Host "Generating schedule..."
try {
    $genResponse = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/schedule/generate" -ContentType "application/json" -Headers $headers
    Write-Host "Schedule generated successfully."
    # $genResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Schedule generation FAILED: $($_.Exception.Message)"
    if ($_.ErrorDetails) { Write-Host "Details: $($_.ErrorDetails.Message)" }
}

# 3. Fetch Schedule
Write-Host "--- Latest Schedule ---"
try {
    $getSchedule = Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/schedule" -Headers $headers
    $getSchedule | ConvertTo-Json -Depth 5
} catch {
    Write-Host "GET schedule FAILED: $($_.Exception.Message)"
}
