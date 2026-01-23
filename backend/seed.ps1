try {
    Write-Host "Attempting to seed properties..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Method Post -Uri "http://localhost:5001/api/properties/seed"
    Write-Host "Success: $($response.message)" -ForegroundColor Green
    Write-Host "Seeded $($response.count) properties." -ForegroundColor Green
} catch {
    Write-Host "Error: Could not connect to backend." -ForegroundColor Red
    Write-Host "Please ensure the backend server is running on port 5001 and has been restarted to include the new changes." -ForegroundColor Yellow
    Write-Host "Details: $_" -ForegroundColor Red
}
Read-Host -Prompt "Press Enter to exit"
